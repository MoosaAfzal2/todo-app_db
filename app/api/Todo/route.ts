import { NextRequest, NextResponse } from "next/server";
// import { db } from "@vercel/postgres";
import { db, TodoTable, Todo, NewTodo } from "@/app/lib/Drizzle";
import { sql } from "@vercel/postgres"

export async function GET(request: NextRequest) {
    // const client = await db.connect()
    try {
        await sql`CREATE TABLE IF NOT EXISTS Todos(id serial, Task varchar(255))`

        const res: Todo[] = await db.select().from(TodoTable)
        console.log(res)
        return NextResponse.json({ message: "Api Called Successfully!" })
    }
    catch (error) {
        console.log((error as { message: string }).message);
        return NextResponse.json({ message: "Something Went Wrong!" })
    }
}


export async function POST(request: NextRequest) {
    // const client = await db.connect()
    const req = await request.json()
    try {
        if (req.Task) {
            await sql`INSERT INTO Todos (Task) VALUES(${req.Task})`
            db.insert(TodoTable).values({
                Task: req.Task
            }).returning()
            return NextResponse.json({ message: "Task Added Successfully!" })
        }
        else {
            throw new Error("Task field is Required")
        }
    }
    catch (error) {
        console.log((error as { message: string }).message);
    }
}