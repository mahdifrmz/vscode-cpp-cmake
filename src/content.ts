import * as fs from 'fs'
import { Dir } from './file'
import * as path from 'path'
import { isRegExp } from 'util'

enum Templates {
    CMake = 'CMakeLists.txt',
    Launch = 'launch.json',
    Tasks = 'tasks.json',
    Main = 'main.cpp',
    GitIgnore = '.gitignore'
}

export function getContent (dirname:string) : Dir{

    const formatter = {
        'projname':dirname
    }

    const src : Dir = {
        name:'src',
        type:'dir',
        content:[
            {
                type:'file',
                name:Templates.Main,
                content:loadTemplate(Templates.Main,formatter)
            }
        ]
    }
    const inlcude : Dir = {
        type:'dir',
        name:'include',
        content:[]
    }
    const build : Dir = {
        type:'dir',
        name:'build',
        content:[
            {
                type:'dir',
                name:'debug',
                content:[]
            },
            {
                type:'dir',
                name:'release',
                content:[]
            }
        ]
    }
    const vscode : Dir = {
        type:'dir',
        name:'.vscode',
        content:[
            {
                type:'file',
                name:Templates.Launch,
                content:loadTemplate(Templates.Launch,formatter)
            },
            {
                type:'file',
                name:Templates.Tasks,
                content:loadTemplate(Templates.Tasks,formatter)
            }
        ]
    }


    const root : Dir = {
        type:'dir',
        name:dirname,
        content:[
            src,inlcude,vscode,build,
            {
                type:'file',
                name:Templates.CMake,
                content:loadTemplate(Templates.CMake,formatter)
            },
            {
                type:'file',
                name:Templates.GitIgnore,
                content:loadTemplate(Templates.GitIgnore,formatter)
            },
        ]
    }

    return root
}

function loadTemplate (name:string,format:{[id:string]:string}) : string{
    if(name == Templates.GitIgnore)
        name = 'gitignr'
    let content = fs.readFileSync(path.resolve(__dirname,'../templates/'+name)).toString()
    Object.keys(format).forEach(ele=>{
        const find = '%'+ele;
        const re = new RegExp(find, 'g');
        content = content.replace(re,format[ele])
    })
    return content
}