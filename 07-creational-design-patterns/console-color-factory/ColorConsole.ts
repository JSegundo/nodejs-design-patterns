// 7.1 Console color factory: Create a class called ColorConsole that has just
// one empty method called log(). Then, create three subclasses: RedConsole,
// BlueConsole, and GreenConsole. The log() method of every ColorConsole
// subclass will accept a string as input and will print that string to the console
// using the color that gives the name to the class. Then, create a factory
// function that takes color as input, such as 'red', and returns the related
// ColorConsole subclass. Finally, write a small command-line script to try
// the new console color factory. You can use this Stack Overflow answer as
// a reference for using colors in the console: nodejsdp.link/console-colors.

var argv = (process.argv.slice(2));

interface IColorConsole {
    log(str: string): void;
}
class ColorConsole implements IColorConsole {
  log(str:string):void{}
}



class RedConsole extends ColorConsole {
    log(str:string){
        console.log("\x1b[31m",str)
    }
}

class BlueConsole extends ColorConsole {
    log(str:string){
        console.log("\x1b[34m", str)
    }
}

class GreenConsole extends ColorConsole {
    log(str:string){
        console.log("\x1b[32m",str)
    }
}

function colorConsoleFactory(color){
    switch(color){
        case "red":
            return new RedConsole()
        case "blue":
            return new BlueConsole()
        case "green":
            return new GreenConsole()
            default:
                throw new Error('We dont have that color')
    }
}

const color = argv[0]
const colorConsole = colorConsoleFactory(color) 
colorConsole.log('this is the log i want to see colored')

// npx tsx file.ts