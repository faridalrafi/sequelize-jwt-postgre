npm install express-generator -g
mkdir nodejs-api
cd nodejs-api
express -f
sudo npm install express sequelize-cli pg pg-hstore jsonwebtoken bcryptjs --save
node_modules/.bin/sequelize init
node_modules/.bin/sequelize model:create --name User --attributes name:String,username:String,email:string,password:String
node_modules/.bin/sequelize model:create --name Role --attributes name:String
node_modules/.bin/sequelize db:create
node_modules/.bin/sequelize db:migrate

