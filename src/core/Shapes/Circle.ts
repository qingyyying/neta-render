import { ShapeType } from "..";
import { Point } from "../math";
import { Shape } from "./Shape";

export class Circle extends Shape {
  public x: number;
  public y: number;
  public radius: number;
  public readonly type = ShapeType.Circle;

  constructor(x = 0, y = 0, radius = 0) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  public contains(p: Point): boolean {
    console.log('======');
    console.log('(p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y): ', (p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y));
    
    console.log(p, this.x, this.y);
    
    if (
      (p.x - this.x) * (p.x - this.x) + (p.y - this.y) * (p.y - this.y) <
      this.radius * this.radius
    ) {
      return true;
    } else {
      return false;
    }
  }
}
