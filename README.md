# webserver-frontend


## Setup the develop environment
### 1. Clone the repository
```bash
# host
$ git clone git@bitbucket.org:androvideo/webserver-frontend.git
$ cd webserver-frontend
$ npm install
```

### 2. Start the develop server
```bash
$ npm start
```


## Build
```bash
$ npm run build
```


## Branches
+ [master](http://192.168.100.137/cloud/webserver-frontend/tree/master)  
  The main branch.  
  How to push commits?
  1. Create your new branch from `master`.
  2. Push commits to your new branch.
  3. Create a merge-request from your new branch to `master`.
  + note: Merge master into avn before release.
+ [avn](http://192.168.100.137/cloud/webserver-frontend/tree/avn)  
  The ArecontVision branch.  
  How to push commits?
  1. Create your new branch from `avn`.
  2. Push commits to your new branch.
  3. Create a merge-request from your new branch to `avn`.
  + note: Don't merge avn into master.
