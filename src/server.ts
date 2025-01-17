import express, { Request, Response, NextFunction } from "express"
import { routes } from "./routes/index"
import { AppError } from "./utils/AppError"
import { ZodError } from "zod"

const PORT = 3333
const app = express()
app.use(express.json())

app.use(routes)

/**
 * 400 (Bad Request): Erro do cliente.
 * 500 (Internal Server Error): Error interno do servidor.
 */

app.use((error: any, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof AppError){
    response.status(error.statusCode).json({ message: error.message })
  }

  if (error instanceof ZodError){
    response
    .status(400)
    .json({ message: "Validation error!", issues: error.format()})
  }

  response.status(500).json({ message: error.message })
})

app.listen(PORT, () => console.log(`Serve is running on port ${PORT}`))

