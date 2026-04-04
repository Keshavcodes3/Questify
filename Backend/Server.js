
import app from './src/App.js'
import connection from './src/Config/Database.js'

connection()

const PORT=process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})