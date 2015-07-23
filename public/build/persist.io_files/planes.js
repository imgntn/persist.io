var dTexturesArray = [];
var planesContainer;

function initPlanes() {
    console.log('desires at initPlanes', Desires.initialDesires.length)


    var projector;



    planesContainer = new THREE.Object3D();
    scene2.add(planesContainer);
    projector = new THREE.Projector();
    var planes = new Array();
   
    var numOfPlanesY = 10;
     var numOfPlanesX = listToMatrix(Desires.initialDesires,numOfPlanesY).length;
    var side = 50;
    var offset = side / 2;
    var textSize = '';
    textSize = textSize + side * 2.5 + 'px'
    for (var x = 0; x < numOfPlanesX; x++) {
        for (var y = 0; y < numOfPlanesY; y++) {

            var dynamicTexture = new THREEx.DynamicTexture(512, 512)

            var material = new THREE.MeshBasicMaterial({
                map: dynamicTexture.texture,
                // depthWrite: false, depthTest: false,
                side: THREE.DoubleSide
            })
            var plane = new THREE.Mesh(new THREE.PlaneGeometry(side, side, 1, 1), material);

            //dynamicTextureMeshes.push(dynamicTexture);
            // var planeColor = new THREE.Color(Math.random() * 0xFFFFFF);
            // dynamicTexture.clear(planeColor.getContextStyle());
            // var textColor = new THREE.Color(Math.random() * 0xFFFFFF);

            // dynamicTexture.drawText('THIS IS A TEST OF A LONGER TEXT A LONGER LONGER TEXT', 32, 32, textColor.getContextStyle(), "32pt Helvetica")

            dTexturesArray.push(dynamicTexture)

            // plane = new THREE.Mesh(
            //     new THREE.PlaneGeometry(50, 50, 1, 1),
            //     new THREE.MeshBasicMaterial({
            //         color: Math.random() * 0xFFFFFF
            //     })
            // );

            plane.position.x = -(x * (side + offset));
            plane.position.y = -(y * (side + offset));
            plane.doubleSided = true;

            planes.push(plane);
            planesContainer.add(plane);
            plane.rotation.x = Math.PI / 2
        }
    }
    updatePlaneTexts();
    planesContainer.position.x = -750;
    planesContainer.position.z = -150;
    planesContainer.position.y = 1400;
    planesContainer.scale.x = 2;
    planesContainer.scale.y = 2;


}

// var arr = [1,2,3,4,5,6,7,8,9]

// var newArr = [];
// while(arr.length) newArr.push(arr.splice(0,3));

// console.log(newArr)
var scratchDesires = []

function updatePlaneTexts(size) {
    _.each(dTexturesArray, function(dTexture, index) {
        if(typeof Desires.initialDesires[index]==='undefined'){
            return
        }
        var planeColor = new THREE.Color(Math.random() * 0xFFFFFF);
        dTexture.clear(planeColor.getContextStyle());
        var textColor = new THREE.Color(Math.random() * 0xFFFFFF);
        var text = Desires.initialDesires[index].txt;
            var tmpDate = new Date();
            var tmpDateString1=tmpDate.toLocaleDateString();
            var tmpDateString2=tmpDate.toLocaleTimeString();
            var tmpDateString3=tmpDateString1+" "+tmpDateString2;

            text =text+" @"+tmpDateString3
        dTexture.drawText(text, 32, 128, textColor.getContextStyle(), "64pt Helvetica")

        Desires.desireIndex = Math.floor(Math.random() * Desires.initialDesires.length);

        dTexture.texture.needsUpdate = true
    })

}

function changePlane() {

    var tileIndex = Math.floor(Math.random() * dTexturesArray.length);
    var desireIndex = Math.floor(Math.random() * Desires.initialDesires.length);
    var dTexture = dTexturesArray[tileIndex];
    var planeColor = new THREE.Color(Math.random() * 0xFFFFFF);
    dTexture.clear(planeColor.getContextStyle());
    var textColor = new THREE.Color(Math.random() * 0xFFFFFF);
    var text = Desires.initialDesires[desireIndex].txt;
    var tmpDate = new Date(Desires.initialDesires[desireIndex].createdAt);
    var tmpDateString1 = tmpDate.toLocaleDateString();
    var tmpDateString2 = tmpDate.toLocaleTimeString();
    var tmpDateString3 = tmpDateString1 + " " + tmpDateString2;

    text = text + ' @' + tmpDateString3
    dTexture.drawText(text, 32, 64, textColor.getContextStyle(), "64pt Helvetica");
    dTexture.texture.needsUpdate = true
}

function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}