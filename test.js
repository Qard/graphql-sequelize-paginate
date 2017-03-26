var tap = require('tap')
var page = require('graphql-page')
var makeFind = require('./')

var db = [
  { id: 1, foo: 'bar' },
  { id: 2, foo: 'bar' },
  { id: 3, foo: 'bar' },
  { id: 4, foo: 'bar' },
  { id: 5, foo: 'bar' },
]

function gt(a) {
  return function(b) { return b.id > a }
}
function lt(a) {
  return function(b) { return b.id < a }
}

var lastQuery
const mockModel = {
  findAll(query) {
    lastQuery = query
    var list = db.slice()

    if (query.where && query.where.id && query.where.id) {
      var id = query.where.id
      var filter = 'gt' in id ? gt(id.gt) : lt(id.lt)
      list = list.filter(filter)
    }
    if (query.limit) {
      list = list.slice(0, Math.min(query.limit, list.length))
    }
    return Promise.resolve(list)
  }
}

var find
tap.test('should construct', t => {
  t.doesNotThrow(() => {
    find = makeFind({
      model: mockModel,
      min: 1,
      max: 2
    })
  })
  t.end()
})

tap.test('find first', t => {
  find({ first: 2 })
  t.strictSame(lastQuery, {
    limit: 3,
    order: 'id ASC'
  })
  t.end()
})

tap.test('find last', t => {
  find({ last: 2 })
  t.strictSame(lastQuery, {
    limit: 3,
    order: 'id DESC'
  })
  t.end()
})

tap.test('find before', t => {
  find({ first: 2, before: 'Mq==' })
  t.strictSame(lastQuery, {
    limit: 3,
    order: 'id ASC',
    where: { id: { lt: 2 } }
  })
  t.end()
})

tap.test('find after', t => {
  find({ first: 2, after: 'Mq==' })
  t.strictSame(lastQuery, {
    limit: 3,
    order: 'id ASC',
    where: { id: { gt: 2 } }
  })
  t.end()
})

// Verify extra query options work with and without before/after
tap.test('find with query', t => {
  find({ first: 2 }, {
    where: {
      foo: 'bar'
    }
  })
  t.strictSame(lastQuery, {
    limit: 3,
    order: 'id ASC',
    where: { foo: 'bar' }
  })

  find({ first: 2, after: 'Mq==' }, {
    where: {
      foo: 'bar'
    }
  })
  t.strictSame(lastQuery, {
    limit: 3,
    order: 'id ASC',
    where: {
      id: { gt: 2 },
      foo: 'bar'
    }
  })

  t.end()
})

tap.test('paginates', t => {
  find({ first: 2, after: 'Mq==' }).then(result => {
    var list = db.slice(2, 4)
    t.strictSame(result, {
      count: 2,
      edges: list.map(page.toEdge),
      pageInfo: page.pageInfo(list, {
        hasNextPage: true,
        hasPreviousPage: true
      })
    })
    t.end()
  })
})
