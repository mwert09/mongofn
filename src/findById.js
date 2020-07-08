import { andThen, inc, pipe, uncurryN } from 'ramda';

import useCollection from './useCollection';

/**
 * Takes a {@link MongoClientLike}, a database name, a collection name, and an id, then
 * returns `Promise` which resolves the (Document)[https://docs.mongodb.com/manual/core/document/] with given id in specified `Collection`
 * in MongoDB.
 *
 * `id` anything that MongoDB Driver accepts
 *
 * It is a curried function so it can be partially recomposed.
 * Since [Ramda](https://ramdajs.com/) is used for currying, you can also use [R.__](https://ramdajs.com/docs/#__)
 * placeholder to allow partial application of any combination of arguments of this particular function.
 *
 * @func findBy
 * @since v0.1.0
 * @param {MongoClientLike} client {@link MongoClient} instance
 * @param {string} databaseName Database name to get the collection from.
 * @param {string} collectionName Collection name to get find results from.
 * @param {any} id Id of the document to be fetched.
 * @return {Promise<object>} Document with given id.
 * @see {@link findByObjectId}, {@link createClient}
 * @example
 *
 *      // complete usage
 *      // See createClient docs for more information
 *      const client = createClient(...params);
 *      findBy(client, 'databaseName', 'collectionName', someId)
 *      .then(console.log);
 *
 *      // partial reusability
 *      const findInSomeDbById = findById(someCliemt, 'someDb');
 *      findCategoriesBy('categories', someId).then(category => {});
 *      findCategoriesBy('articles', someOtherId).then(article => {});
 *
 */
const findById = uncurryN(
  inc(useCollection.length),
  pipe(
    useCollection,
    uncurryN(
      2,
      (collectionPromise) => (id) => andThen((collection) => collection.findOne({ _id: id }), collectionPromise),
    ),
  ),
);

export default findById;