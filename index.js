var validator = require('validate-graphql-page-args')
var page = require('graphql-page')

function fromCursor(cursor) {
  return Number(page.fromCursor(cursor))
}

function subQuery(args) {
  return args.after
    ? { gt: fromCursor(args.after) }
    : { lt: fromCursor(args.before) }
}

module.exports = makeFind
function makeFind(opts) {
  var model = opts.model
  delete opts.model
  var validate = validator(opts)

  return function find(args, query) {
    validate(args)
    query = query || {}

    var hasCursor = args.before || args.after
    var count = args.first || args.last

    // NOTE: The limit is increased by 1 to check for next page
    query.limit = count + 1

    // Control order by first or last direction
    query.order = `id ${args.last ? 'DESC' : 'ASC'}`

    // Use before or after cursors to move the query window
    if (hasCursor) {
      query.where = query.where || {}
      query.where.id = subQuery(args)
    }

    // Run the query
    return model.findAll(query).then(function (records) {
      // Check if there's a previous record
      let hasPreviousPage = args.before || args.after
      let hasNextPage = false
      if (records.length > count) {
        records.pop()
        hasNextPage = true
      }

      return page(records, {
        hasPreviousPage,
        hasNextPage
      })
    })
  }
}
