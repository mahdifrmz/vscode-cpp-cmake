import * as fs from 'fs'
import * as path from 'path'

export interface File {
    type : 'file'
    name: string
    content: string
}

export interface Dir {
    type : 'dir'
    name: string
    content : Array<File | Dir>
}

interface VerificationResult {
    status : InputResult
    dir : string
    name : string
}

export enum InputResult {
    ok,
    isFile,
    isNotEmpty,
    parentNotExist
}

export function verifyAddress (str : string) : VerificationResult{
    const full = path.resolve(str)
    const name = path.basename(full)
    const dir = path.dirname(full)
    if(!fs.existsSync(dir)){
        return {name,dir,status: InputResult.parentNotExist}
    }
    if(fs.existsSync(full)){
        if(fs.lstatSync(full).isFile()){
            return {name,dir,status: InputResult.isFile}
        }
        else if(fs.readdirSync(full).length != 0){
            return {name,dir,status: InputResult.isNotEmpty}
        }
    }

    return {name,dir,status:InputResult.ok}
}

export function createDir( dir : Dir, parent : string) : void{
    const dirPath = path.resolve(parent,dir.name)
    if(!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath)
    }

    for(let i=0;i<dir.content.length;i++){
        if(dir.content[i].type == 'dir'){
            const newDir : Dir = <Dir> dir.content[i]
            createDir(newDir,dirPath)
        }
        else{
            const newFile : File = <File> dir.content[i]
            const newFilePath = path.resolve(dirPath,newFile.name)
            if(!fs.existsSync(newFilePath)){
                fs.writeFileSync(newFilePath,newFile.content)
            }
        }
    }
}
