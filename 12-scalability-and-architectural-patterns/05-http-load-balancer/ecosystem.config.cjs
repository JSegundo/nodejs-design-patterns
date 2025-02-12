module.exports = {
    apps:[{
        name:"app",
        script:"./app.js",
        instances: 4,
        exec_mode:"fork", // separate ports
        env:{
            PORT:8081
        },
        increment_var : 'PORT',     // Tell PM2 to increment the PORT variable
        watch:true, // restart on file changes
        max_memory_restart:"300M"
    }]
}

