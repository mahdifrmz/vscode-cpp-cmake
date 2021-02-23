# C++ CMake Code Project (CCCP)

generates root directory of c++ cmake project configured for visual studio code:
```
$ cccp dir
```
where **dir** is the address of directory you want to be the root of project

can be used without any argument to create template files in the cuurent directory

## features
- generating CMakeLists.txt file for build config
- creates .vscode folder including launch.json and tasks.json for building and debugging
- initializes git repository in the root of project (in case git is installed)

## requirements
* node and npm
* cmake
* git (optional)

## install
can be installed using npm:
```
$ npm install -g ccvcp
```
## issues and contribution

any pull request and contribution is welcome and if ran into any **issue**, just let us know