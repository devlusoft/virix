#!/usr/bin/env node

const command = process.argv[2]

switch (command) {
  case 'dev':
    await import('../lib/cli/dev.js')
    break
  case 'build':
    await import('../lib/cli/build.js')
    break
  case 'start':
    await import('../lib/cli/start.js')
    break
  case '--version':
  case '-v':
    console.log('0.1.0')
    break
  case '--help':
  case '-h':
    console.log(`                                                                                                                                                                                                                    
   virix — meta-framework ligero de Vue                                                                                                                                                                                                 
                                                                                                                                                                                                                                        
   Usage:                                                                                                                                                                                                                               
     virix dev        Start development server                                                                                                                                                                                          
     virix build      Build for production                                                                                                                                                                                              
     virix start      Start production server                                                                                                                                                                                           
       `.trim())
    break
  default:
    console.error(`Unknown command: ${command}`)
    console.error('Usage: virix <dev|build|start>')
    process.exit(1)
}

export {}