const  uuid = require('uuid/v4')
console.log(JSON.stringify({
    _id: `user_id_${uuid()}`,
    avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    email: 'email2@example.com'
  }))