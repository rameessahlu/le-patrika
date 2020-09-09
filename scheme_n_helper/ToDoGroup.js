import Realm from 'realm';

export const GROUP_SCHEMA = 'Group';

//define model and it's prop
export const GroupSchema = {
  name: GROUP_SCHEMA,
  primaryKey: 'key',
  properties: {
    name: 'string',
    key: 'string',
    backgroundColor: 'string',
  },
};

const databaseOptions = {
  path: 'lePatrika.realm',
  schema: [GroupSchema],
};

export const insertNewGroup = (newGroup) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        realm.write(() => {
          realm.create(GROUP_SCHEMA, newGroup);
          resolve(newGroup);
        });
      })
      .catch((error) => reject(error));
  });

export const queryAllGroupLists = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then((realm) => {
        let allGroupList = realm.objects(GROUP_SCHEMA);
        resolve(allGroupList);
      })
      .catch((error) => {
        reject(error);
      });
  });

export default new Realm(databaseOptions);
