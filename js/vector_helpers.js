function setVector(obj) {

    var vector;

    if (obj.x !== 'undefined' && typeof obj.x !== 'undefined') {

        vector = new SAT.Vector(obj.x, obj.y);

        if (typeof obj.width !== 'undefined' && typeof obj.height !== 'undefined') {

            vector = new SAT.Box(vector, obj.width, obj.height);

        }

    }

    return vector;

}

function setEntityVector(entity) {

    var metrics = entity.getAllMetrics();

    entity.__vector = setVector(metrics);

    return entity.__vector;

}

function getEntityVector(entity) {

    if (typeof entity.__vector === 'undefined') {

        setEntityVector(entity);

    }

    return entity.__vector;

}

function checkCollision(a, b) {

    var test = false;

    if (a && !(a instanceof SAT.Box)) { a = setVector(a); }
    if (b && !(b instanceof SAT.Box)) { b = setVector(b); }

    if (a instanceof SAT.Vector && b instanceof SAT.Box) {

        test = SAT.pointInPolygon(a, b.toPolygon());

    } else if (b instanceof SAT.Vector && a instanceof SAT.Box) {

        test = SAT.pointInPolygon(b, a.toPolygon());

    } else if (a instanceof SAT.Box && b instanceof SAT.Box) {

        test = SAT.testPolygonPolygon(a.toPolygon(), b.toPolygon());

    }

    return test;

}
