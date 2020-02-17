import { PtBr } from "./pt-br/PtBr";

export class Translation {
  static t(term) {    
    return PtBr.translate(term);
  }
}