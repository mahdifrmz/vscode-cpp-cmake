#! /usr/bin/node

import { verifyAddress,InputResult,Dir, createDir } from './file'
import { getContent } from './content'
import { git,cmake,CMakeBuildType ,cmakeExists, gitExists } from './command'
import * as path from 'path'
import { exit } from 'process'

if(!cmakeExists()){
    console.error('cmake is not installed')
    exit(1)
}

const args = process.argv.slice(2)
const initializingInCurrentDir = args.length == 0
let fileAddress : string
if (initializingInCurrentDir) {
    fileAddress = '.'
}
else{
    fileAddress = args[0]
}

const rsl = verifyAddress(fileAddress)
const dirname = rsl.name
const parent = rsl.dir

const baseError = {
    address:'invalid address'
}

function addressError (text:string) : string {
    return `${baseError.address} '${fileAddress}' : ${text}`
}

if(rsl.status != InputResult.ok){
    if(rsl.status == InputResult.isFile) console.log(addressError('resolves to a file'))
    else if(rsl.status == InputResult.isNotEmpty) console.log(addressError('is a non-empty directory'))
    else console.log(addressError('does not exist'))
    exit(1)
}

if (initializingInCurrentDir) {
    console.log('creating in current directory')
}
else{
    console.log(`creating in ${fileAddress} directory`)
}

const root : Dir = getContent(dirname)
createDir(root,parent)

commands(path.resolve(parent,root.name))

function commands (root:string) : void{
    if(gitExists()){
        git(root,(rsl:boolean)=>{
            if(!rsl){
                console.log('initializing git repository failed')
            }
            else{
                console.log('git repo initialized')
            }
            cmakeCommand()
        })
    }
    else cmakeCommand()

    function cmakeCommand(){
        cmake(path.resolve(root,'build/debug'),root,CMakeBuildType.Debug,(rsl)=>{
            if(!rsl){
                console.log('initializing build failed')
            }
            else{
                cmake(path.resolve(root,'build/release'),root,CMakeBuildType.Release,(rsl)=>{
                    if(!rsl){
                        console.log('initializing build failed')
                    }
                })
            }
        })
    }
}