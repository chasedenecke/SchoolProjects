db.auth('root','password1');

db.createUser({
  user: 'jmanosu',
  pwd: 'password1',
  roles: [ { role: "readWrite", db: "RADatabase" } ]
});