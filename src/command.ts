import {exec} from "child_process"
import * as path from 'path'
import * as isInstalled from 'command-exists'

export function git(sourceAddress:string,cb:(result:boolean)=>void) : void {
    exec('git init',{cwd:sourceAddress},(err)=>{
        if(err){
            cb(false)
        }
        else{
            cb(true)
        }
    })
}

export enum CMakeBuildType {
    Debug = 0,
    Release = 1
}

export function cmake(buildAddress:string,sourceAddress:string,buildType:CMakeBuildType,cb:(result:boolean)=>void) : void{
    const command = `cmake ${
        buildType == CMakeBuildType.Debug ? '-DCMAKE_BUILD_TYPE=Debug' : '-DCMAKE_BUILD_TYPE=Release'
    } ${path.relative(buildAddress,sourceAddress)}`

    exec(command,{cwd:buildAddress},(err)=>{
        if(err){
            cb(false)
        }
        else{
            cb(true)
        }
    })
}

export function gitExists(): boolean {
    return isInstalled.sync('git')
}

export function cmakeExists(): boolean {
    return isInstalled.sync('cmake')
}