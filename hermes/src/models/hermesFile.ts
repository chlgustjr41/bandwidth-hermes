import { JsonObject, JsonProperty, JsonSerializer, throwError } from "typescript-json-serializer";
import CryptoJS from "crypto-js";

@JsonObject()
export class HermesFile{

    // ASCII representation of the word HERMES
    static MAGIC_NUMBER: string = "726982776983";

    constructor(
        @JsonProperty() public name : string,
        @JsonProperty() public version: string,
        @JsonProperty() public instance: any,
        @JsonProperty() public hash: string

    ) {
        this.name = name;
        this.version = version;
        this.instance = instance;
        this.hash = hash;
    }

    static loadValidation(val: string): HermesFile {
        
        let data: HermesFile = JSON.parse(val) as HermesFile;
        if(!data.name || !data.version || !data.instance || !data.hash){
            throw new Error();            
        }
        
        if (HermesFile.hashFile(JSON.stringify(data.instance)) != data.hash){
            throw new Error();
        }
            
        return data;
    }

    static hashFile(json: string): string {
        return CryptoJS.SHA256(HermesFile.MAGIC_NUMBER + json).toString(
            CryptoJS.enc.Hex
          );
    }
}