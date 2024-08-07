import { ShapeType } from "../enums";
import { Point } from "../math";
import { Shape } from "./Shape";

export class Polygon extends Shape {
  public shapePoints: number[];
  public points: number[]; // 多边形由多个点构成，points数组每2个元素代表一个顶点的坐标
  public x: number;
  public y: number;
  public offsetX: number;
  public offsetY: number;
  public closeStroke = false;
  public readonly type = ShapeType.Polygon;
  constructor(x = 0, y = 0, name?: string, points: number[] = []) {
    super();

    this.offsetX = x;
    this.offsetY = y;

    this.x = 0;
    this.y = 0;
    this.name = name;
    this.shapePoints = points;
    this.points = points;
  }

  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;

    const _x = this.x + this.offsetX;
    const _y = this.y + this.offsetY;
    const transferPoints = this.shapePoints.map((point, index) => {
      if (index & 1) {
        return point + _y;
      }
      return point + _x;
    });
    this.points = transferPoints;
  }

  /**
   *
   * @param px 待检测点的x坐标
   * @param py 待检测点的y坐标
   * @param p1x 线段的其中一个端点的x坐标
   * @param p1y 线段的其中一个端点的y坐标
   * @param p2x 线段的另一个端点的x坐标
   * @param p2y 线段的另一个端点的y坐标
   * @returns {boolean} 从待检测点发出的射线是否与线段相交
   */
  private isIntersect(
    px: number,
    py: number,
    p1x: number,
    p1y: number,
    p2x: number,
    p2y: number
  ) {
    // 线段在射线上方
    if (p1y > py && p2y > py) {
      return false;
    }

    // 线段在射线下方
    if (p1y < py && p2y < py) {
      return false;
    }

    // 线段的两个端点都在待检测点的左边
    if (p1x < px && p2x < px) {
      return false;
    }

    // 线段的2个端点都在待检测点的右边
    if (p1x > px && p2x > px) {
      return true;
    }

    const p2o = p1y - p2y;
    const p1o = p2x - p1x;
    const p2q = py - p2y;

    const x = p2x - (p1o / p2o) * p2q;
    if (x > px) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @param p 待检测点
   * @returns {boolean} 待检测点是否在多边形内部
   */
  public contains(p: Point): boolean {
    const len = this.points.length;

    // 如果多边形只有2个或者2个以下的点，则判断没有碰撞
    if (len <= 4) {
      return false;
    }

    let count = 0;

    // points数组的每两个元素为一个顶点的坐标
    for (let i = 2; i <= len - 2; i += 2) {
      const p1x = this.points[i - 2];
      const p1y = this.points[i - 1];
      const p2x = this.points[i];
      const p2y = this.points[i + 1];
      if (this.isIntersect(p.x, p.y, p1x, p1y, p2x, p2y)) {
        count++;
      }
    }

    // 还需要判断最后一个点和第一个点的连线是否与射线相交
    const p1x = this.points[0];
    const p1y = this.points[1];
    const p2x = this.points[len - 2];
    const p2y = this.points[len - 1];
    if (this.isIntersect(p.x, p.y, p1x, p1y, p2x, p2y)) {
      count++;
    }

    if (count % 2 === 0) {
      return false;
    } else {
      return true;
    }
  }
}
