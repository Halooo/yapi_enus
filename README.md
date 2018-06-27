# Hao's notes

* nodejs（7.6+)
* mongodb（2.6+）

## Get started

- Create a new folder call it `my-yapi` (or other names you prefer), clone this repository under this folder.
```shell
mkdir my-yapi && cd my-yapi && git clone git@github.com:Halooo/yapi_enus.git
```
- Copy `config_example.json` and paste it under `/my-yapi`, rename `config_example.json` to `config.json` and [edit the configuration](#sample-config-file) to suite your needs
```shell
cp config_example.json ../ && mv ../config_example.json ../config.json
```
- `mkdir log` under `/my-yapi`

`npm install -g ykit`

to build the front-end code, first navigate to `/vendors`, then

```shell
npm run build-client
```

after building client, [configure mongoDB](#configure-mongodb) then start the server

```shell
node server/app.js
```

or

```shell
npm run start
```

the server starts default on 3000 port (127.0.0.1:3000), this can be changed in `config.json` file


# Sample Config File

```bash
{
  "port": "3000",
  "adminAccount": "admin@admin.com",
  "db": {
    "servername": "127.0.0.1",
    "DATABASE":  "yapi",
    "port": 27017,
    "user": "test1",
    "pass": "test1"
  },
  "mail": {
    "enable": false,
    "host": "smtp.163.com",
    "port": 465,
    "from": "***@163.com",
    "auth": {
        "user": "***@163.com",
        "pass": "*****"
    }
  }
}
```

# Configure MongoDB
```bash
# brew install mongodb

# brew services start mongodb

# mongo
```

```bash
MongoDB shell version v3.6.2
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.6.2
Welcome to the MongoDB shell.

#switch to admin
> use admin
switched to db admin

#create admin user myadmin
> db.createUser({user:"myadmin",pwd:"secret",roles:[{role:"root",db:"admin"}]})

Successfully added user: {
	"user" : "myadmin",
	"roles" : [
		{
			"role" : "root",
			"db" : "admin"
		}
	]
}

#check users
> show users
{
	"_id" : "admin.myadmin",
	"user" : "myadmin",
	"db" : "admin",
	"roles" : [
		{
			"role" : "root",
			"db" : "admin"
		}
	]
}

#create yapi db
> use yapi
switched to db yapi

#create user test1
> db.createUser({user:"test1",pwd:"test1",roles:[{role:"readWrite",db:"yapi"}]})

Successfully added user: {
	"user" : "test1",
	"roles" : [
		{
			"role" : "readWrite",
			"db" : "yapi"
		}
	]
}

#check users
> show users
{
	"_id" : "yapi.test1",
	"user" : "test1",
	"db" : "yapi",
	"roles" : [
		{
			"role" : "readWrite",
			"db" : "yapi"
		}
	]
}
```



### License
Apache Licene 2.0

