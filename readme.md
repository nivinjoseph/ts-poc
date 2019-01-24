POC to prove full-stack development using TypeScript.

# Environment Setup

- Install Docker (if on windows, make sure you set it to run nix containers)

- Install node 8.x

- Install VsCode

- Learn how to use VsCode properly before going further. We don’t use every aspect of the tool but it is important to be comfortable with it in order to be efficient. A chef does not fumble with his/her knives. As coders we cannot be fumbling with our tools (code editor, IDE, command line, etc  
https://app.pluralsight.com/library/courses/visual-studio-code/table-of-contents  

- Make sure you have git installed and that you are comfortable with working with git on the command line. We use git for source control.  
https://app.pluralsight.com/library/courses/git-fundamentals/table-of-contents  
- Open VsCode.
- If you are on Windows, switch the terminal to bash instead of powershell. There is a setting to make this change permanent in VsCode. Refer to VsCode docs  
https://code.visualstudio.com/docs/editor/integrated-terminal  

- In VsCode use ctrl+shift+p (cmd+shift+p on mac) to open the command palette and run the Shell command: Install 'code' command in path. This will make sure you can run VsCode command from the command line.  

- Install the following VsCode plugins by copying and pasting the entire snippet below into the vscode terminal and pressing enter/return

        code --install-extension christian-kohler.npm-intellisense
        code --install-extension christian-kohler.path-intellisense
        code --install-extension donjayamanne.githistory
        code --install-extension eamodio.gitlens
        code --install-extension EditorConfig.EditorConfig
        code --install-extension eg2.tslint
        code --install-extension eg2.vscode-npm-script
        code --install-extension mikestead.dotenv
        code --install-extension ms-vsliveshare.vsliveshare
        code --install-extension msjsdiag.debugger-for-chrome
        code --install-extension octref.vetur
        code --install-extension PeterJausovec.vscode-docker
        code --install-extension robinbentley.sass-indented
        code --install-extension streetsidesoftware.code-spell-checker
        code --install-extension wayou.vscode-todo-highlight
    
- At this point, your VsCode is configured and you are ready to move forward
- The fundamental technologies we use are JavaScript and Node.js. TypeScript is just JavaScript with a few extras. All JavaScript is valid TypeScript. Hence it is very important to be very comfortable with JavaScript and its details before moving forward. Use the following courses to get comfortable with JavaScript.  
https://app.pluralsight.com/library/courses/html-css-javascript-big-picture/table-of-contents  
https://app.pluralsight.com/library/courses/javascript-getting-started/table-of-contents  
https://app.pluralsight.com/library/courses/javascript-fundamentals/table-of-contents  
https://app.pluralsight.com/library/courses/javascript-objects-prototypes/table-of-contents  
https://app.pluralsight.com/library/courses/rapid-es6-training/table-of-contents  
- Now that you are comfortable with JavaScript, we can focus on Node.js.  
https://app.pluralsight.com/library/courses/nodejs-getting-started/table-of-contents  
https://app.pluralsight.com/library/courses/nodejs-advanced/table-of-contents  
- Now that you are comfortable with JavaScript and Node.js, we can focus on TypeScript  
https://app.pluralsight.com/library/courses/typescript-getting-started/table-of-contents  
https://app.pluralsight.com/library/courses/typescript-in-depth/table-of-contents  
- At this point, you should be comfortable with the general technologies that we use. Now it is time to get more specific and focus on the client side. The core client side specific technologies that you need to be comfortable with are HTML, CSS and SASS. HTML and CSS are the building blocks of the web.  
https://app.pluralsight.com/library/courses/html-fundamentals/table-of-contents  
https://app.pluralsight.com/library/courses/css-intro/table-of-contents  
https://app.pluralsight.com/library/courses/css-positioning-1834/table-of-contents  
https://app.pluralsight.com/library/courses/modern-web-layout-flexbox-css-grid/table-of-contents  
- SASS is to CSS what TypeScript is to JavaScript. So SASS is just CSS with a few extras. So all the rules of CSS apply. Hence it is very important to be very comfortable with CSS in order to be efficient. SASS has 2 syntax types, sass and scss (the file extension will be .sass or .scss depending on the syntax being used). We use the scss syntax. Learning SASS is very easy and you can find everything you need to know at https://sass-lang.com/guide.

# Application architecture
The pages of the following document describe the application architecture approach  
https://www.lucidchart.com/invitations/accept/a2eb0822-25be-464f-bc6a-5ed224b8b1ab