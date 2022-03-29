export class Colors {

  public static generateGradient(n: number, inverted=false) {
    let colors: string[] = [];
    for (let i = n - 1; i >= 0; i--) {
      colors.push(this.getFromGradient(i, n, inverted));
    }
    return colors;
  }

  public static getFromGradient(value: number, max_value: number, inverted=false): string {
    var positionInGradient = inverted ? (1 - value / max_value) : value / max_value;
    var r, g, b;
    [r, g, b] = this.hslToRgb(positionInGradient * 180 + 60, 70, 40);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  private static hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h /= 360;
    s /= 100;
    l /= 100;
    var r, g, b;
    if (s == 0) {
      r = g = b = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = this.hueToRgb(p, q, h + 1 / 3);
      g = this.hueToRgb(p, q, h);
      b = this.hueToRgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  private static hueToRgb(p: number, q: number, t: number): number {
    if (t < 0) t++;
    if (t > 1) t--;
    if (t < 1 / 6) { p += (q - p) * 6 * t; }
    else if (t < 1 / 2) { p = q; }
    else if (t < 2 / 3) { p += (q - p) * (2 / 3 - t) * 6 }
    return p;
  }

}
