// currentPalette: Array of HSV objects that are the colors that have been picked so far
// newColor: Color just picked, HSV Object {hue,sat,val}
function adjustGrade(colorPalette) {
  var compScores = totalComp(colorPalette,compGrade);
  var adjScores = totalComp(colorPalette, adjGrade);
  var triScores = totalComp(colorPalette, triGrade);
  var tetScores = totalComp(colorPalette, tetGrade);
  var monoScores = totalComp(colorPalette, monoGrade);
  var allScores = {
    comp: compScores,
    adj: adjScores,
    tri: triScores,
    tet: tetScores,
    mono: monoScores
  };
  return allScores;
}
function totalComp(colorPalette, gradeFunc) {
  let scores = [];
  for (i in colorPalette.length) {
    var colorA = colorPalette[i];
    for (j in range(i + 1, length(colorPalette))) {
      scores.append(gradeFunc(colorA, colorB));
    }
  }
  return scores;
}
function compGrade(currColor, newColor) {
  var complement = {
    h: (currColor.h + 180) % 360,
    s: currColor.s,
    v: currColor.v,
  };
  var grade = calcCloseness(complement, newColor);
  return grade;
}
function adjGrade(currColor, newColor) {
  var adj1 = {
    h: (currColor.h + 30) % 360,
    s: currColor.s,
    v: currColor.v,
  };
  var grade1 = calcCloseness(adj1, newColor);
  var adj2 = {
    h: (currColor.h + 330) % 360,
    s: currColor.s,
    v: currColor.v,
  };
  var grade2 = calcCloseness(adj2, newColor);
  return Math.max(grade1, grade2);
}
function triGrade(currColor, newColor) {
  // original tr1, tri2 max
  var tri1 = {
    h: (currColor.h + 210) % 360,
    s: currColor.s,
    v: currColor.v,
  };
  var grade1 = calcCloseness(tri1, newColor);
  var tri2 = {
    h: (currColor.h + 150) % 360,
    s: currColor.s,
    v: currColor.v,
  };
  var grade2 = calcCloseness(tri2, newColor);
  var grade3 = monoGrade(currColor,newColor);
  return Math.max(grade1, grade2, grade3);
}
function tetGrade(currColor, newColor) {
  // comp, tet1,tet2, original
  var grade1 = compGrade(currColor, newColor);
  var tet1 = {
    h: (currColor.h + 210) % 360,
    s: currColor.s,
    v: currColor.v,
  };
  var grade2 = calcCloseness(tet1, newColor);
  var tet2 = {
    h: (currColor.h + 30) % 360,
    s: currColor.s,
    v: currColor.v,
  };
  var grade3 = calcCloseness(tet2, newColor);
  var grade4 = monoGrade(currColor, newColor);
  return Math.max(grade1,grade2,grade3,grade4);
}
function monoGrade(currColor, newColor) {
  // Proximity to original H
  return calcCloseness(currColor,newColor);
}
function calcCloseness(color1, color2) {
  var hClose = proximity(color1.h, color2.h);
  var sClose = proximity(color1.s, color2.s);
  var vClose = proximity(color1.v, color2.v);

  var closeness = (hClose + sClose + vClose) / 3;
  console.log(
    `HUE GRADE ${hClose}, SAT GRADE ${sClose}, VAL GRADE ${vClose}, AVG ${closeness}`
  );
  return closeness;
}
function proximity(val1, val2) {
  var prox = Math.abs(val1 - val2);
  var gradeDelta = 5;
  if (prox === 0) {
    return 100;
  } else if (prox <= gradeDelta) {
    return 90;
  } else if (prox <= gradeDelta * 2) {
    return 80;
  } else if (prox <= gradeDelta * 3) {
    return 70;
  } else if (prox <= gradeDelta * 4) {
    return 60;
  } else if (prox <= gradeDelta * 5) {
    return 50;
  } else if (prox <= gradeDelta * 6) {
    return 40;
  } else {
    return 30;
  }
}
