class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    this.y = this.y + v.y;
    this.x = this.x + v.x;
    return this;
  }

  sub(v) {
    this.x = this.x - v.x;
    this.y = this.y - v.y;
    return this;
  }

  mult(n) {
    this.x = this.x * n;
    this.y = this.y * n;
    return this;
  }

  div(n) {
    this.x = this.x / n;
    this.y = this.y / n;
    return this;
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  normalize() {
    const m = this.mag();
    this.div(m);
    return this;
  }
}

const distance = (p1, p2) => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
};

const getCollision = (obj1, obj2) => {
  const dist = distance(obj1.position, obj2.position);
  if (dist < obj1.width * 0.5 + obj2.width * 0.5) return true;
  return false;
};

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
