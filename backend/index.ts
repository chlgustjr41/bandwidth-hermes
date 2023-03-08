import express, { Express, Request, Response } from 'express';
import bodyParser, { BodyParser } from 'body-parser'
import { Diagram, VPC, deserialize } from './Diagram';
import { Tree } from './Tree';
import cors from 'cors';
import { Validator } from './Validator';

const jsonParser = bodyParser.json();
const app: Express = express();

app.use(cors());

app.post("/", jsonParser, (request: Request, response: Response) => {
    let diagram: Diagram;

    try {
        diagram = deserialize(JSON.stringify(request.body));
        let validator: Validator = new Validator();
        validator.checkDiagram(diagram);
    }
    catch(e: any) {
        response.statusCode = 400;
        response.send(e.message);
    }

    let tree: Tree = new Tree(diagram!);
    let code: string = tree.compileTree();
    response.send(code);
});

app.listen(10000, () => {
    console.log("Application listening on port 10000");
});