/**
 * Initialize Sankey
 */
function initSankey() {
    /*simple initialisation of the sankey, should explain itself*/

    svg = d3.select("svg"),
        width = +svg.attr("width") - 2*marginleft,
        height = +svg.attr("height") - margintop;

    formatNumber = d3.format(",.0f"),
        format = function (d) { return formatNumber(d) + " %"; },
        color = d3.scaleOrdinal(d3.schemeCategory10);

    sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 1], [width - 1, height - 6]])
        .iterations(0);

    t = d3.transition()
        .duration(1500)
        .ease(d3.easeLinear);

    //set attributes for all links
    titleGroup = svg.append("g")
        .attr("class", "titles")
        .attr("font-family", "sans-serif")
        .attr("font-size", "150%");

    diagram= svg.append("g")
        .attr("class", "sankey")
        .attr("transform", "translate(" + marginleft + "," + margintop + ")");

    linkGroup = diagram.append("g")
        .attr("class", "links")
        .attr("fill", "none");
        //.attr("stroke", "#000")
        //.attr("stroke-opacity", 0.2);

    //set attributes for all nodes
    nodeGroup = diagram.append("g")
        .attr("class", "nodes")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);
}

/**
 * for the filtering and transition by selecting a filter we need to update the sankey and "draw" it new
 * */
function updateSankey() {
    flush();
    filter();
    calculateLinks();
    switch (lang)
    {
        case "ger":
            d3.json("data/labels-ger.json", helper);
            break;
        case "fra":
            d3.json("data/labels-fr.json", helper);
            break;
        case "eng":
            d3.json("data/labels-en.json", helper);
            break;
        default:
            d3.json("data/labels.json", helper);
    }
}

/**
 * Reset Array for link size calculation, we logically need to do this to calculate the links new
 */
function flush() {
    // needs to be changed if more nodes are implemented
    customLinks = [];
    for (i = 0; i < 63; i++) {
        for (j = 0; j < 63; j++) {
            linkSize[i][j] = 0;
        }
    }

    columnCoord = [];
}

/**
 * is used for the years "title" above the nodes in the sankey, remove all excess x position, so that the array has only
 * from each other differently x positions and remove the doubles
 * */
function filterArray(array) {
    var filtered = [];
    $.each(array, function(i, el){
        if($.inArray(el, filtered) === -1) filtered.push(el);
    });

    for (var i = 0; i<filtered.length; i++)
    {
        filtered[i] += marginleft;
    }
    return filtered;
}

/**
 *  the main function for "drawing" the saneky, takes the customLinks that where calculated and returns the saneky
 * */
function helper(error, labels) {
    if (error)
        throw error;
    labels.links = customLinks;
    sankey(labels);
    var links = linkGroup.selectAll('path')
        .data(labels.links);

    //Set attributes for each link separately
    links.enter().append("g")
        .attr("id",function (d,i) {return "path"+i;})
        .attr("from",function (d) { return d.source.name; })
        .attr("to",function (d) { return d.target.name; })
        .append("path")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.15)
        .attr("display", function (d) {
            /* don't display a link if the link is smaller than 4%, else it will be just displayed*/
            if(d.value < 4.0){return "none";}
            else{return "inline";}
        })
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function (d) {return Math.max(1, d.width); })
        .attr("onmouseover",function (d,i) { return "appendGradient(" + i + ")" })
        .attr("onmouseout",function (d,i) { return "removeGradient(" + i + ")" })
        .append("title")
        .text(function (d) {
            //tooltip info for the links
            return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

    linkGroup.selectAll("g").transition(t)
        .attr("id",function (d,i) {return "path"+i;})
        .attr("from",function (d) { return d.source.name; })
        .attr("to",function (d) { return d.target.name; });

    links.transition(t)
        //.attr("from",function (d) { return d.source.name; })
        //.attr("to",function (d) { return d.target.name; })
        //.attr("onmouseover",function (d,i) { return "appendGradient(" + i + ")" })
        //.attr("onmouseout",function (d,i) { return "removeGradient(" + i + ")" })
        .attr("display", function (d) {
            //again if the link is smaller than 4% don't display it, we have to do this method again because of the
            // transition, if another filter is selected
            if(d.value < 4.0){return "none";}
            else{return "inline";}
        })
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", function (d) { return Math.max(1, d.width); })
        .select('title')
        .text(function (d) {
            //same argumentation as above, we need the method again for the transition
            return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

    //remove the unneeded links
    links.exit().remove();

    var nodes = nodeGroup.selectAll('.node')
        .data(labels.nodes);

    var nodesEnter = nodes.enter()
        .append("g")
        .attr('class', 'node');

    //set attributes for each node separately
    nodesEnter.append("rect")
        .attr("x", function (d) { return d.x0; })
        .attr("y", function (d) { return d.y0; })
        .attr("height", function (d) { return d.y1 - d.y0; })
        .attr("width", function (d) {
            var width = d.x1 - d.x0;
            if(d.value > 0)
            {
                //this is used for the years above the nodes, every x position of all nodes is pushed in an array
                columnCoord.push(d.x0 + width/2);
            }
            return width;
        })
        .attr("fill", setColor)
        .attr("stroke", "#000")
        .attr("fill-opacity", 0.5)

    //specify Pop-Up when hovering over node
    nodesEnter.append("title")
        .text(function (d) { return d.name + "\n" + format(d.value); });

    //Update selection
    var nodesUpdate = nodes.transition(t);

    //same as the links we have to state the methods again in the update
    nodesUpdate.select("rect")
        .attr("y", function (d) { return d.y0; })
        .attr("x", function (d) { return d.x0; })
        .attr("height", function (d) { return d.y1 - d.y0; });

    nodesUpdate.select("title")
        .text(function (d) { return d.name + "\n" + format(d.value); });

    //Exit selection
    nodes.exit().remove();

    //we filter all arrays
    columnCoord = filterArray(columnCoord);
    if(!titlesDrawn)
    {
        drawTitles();
        titlesDrawn = true;
    }
}

/**
 * Drawing the years above the sankey
 * */
function drawTitles() {

    var titles = titleGroup.selectAll('.titles')
        .data(years);

    var titlesEnter = titles.enter()
        .append("g")
        .attr('class', 'title');

    /* give the years a specific x position, to expand it just add in setup another year in the variable years like 2019
     * and write a switch statement for "2019" with the next index which would logically be columnCoord[10]
     *
     * the titles have NO transition because they only need to be drawn once!
     * */
    titlesEnter.append('text')
        .attr("x", function (d) {
            switch (d)
            {
                case "2000":
                    return columnCoord[0];
                case "2001":
                    return columnCoord[1];
                case "2002":
                    return columnCoord[2];
                case "2003":
                    return columnCoord[3];
                case "2004":
                    return columnCoord[4];
                case "2005":
                    return columnCoord[5];
                case "2006":
                    return columnCoord[6];
                case "2007":
                    return columnCoord[7];
                case "2010":
                    return columnCoord[8];
                case "2014":
                    return columnCoord[9];
                default:
                    return 0;
            }
        })
        .attr("y", 10)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d;
        });

    /*
     * If a title has the x position 0 (in this case it would be 10) in the sankey, it is in the wrong place
     * because it has not a position from a columnCoord, so we have to remove it, because if not it would appear
     * in the left upper corner
     */
    svg.selectAll('.title')
        .selectAll('text')
        .filter(function (d, i, q) {
            return q[0].attributes[0].nodeValue == 10;
        })
        .remove();
}


/**
 * Set the color of each node
 * @param d the node
 */
function setColor(d) {

    /* the colors are specified in the setup!*/
    //set colors for german labels
    if(lang == "ger")
    {
        switch(d.name)
        {
            case "Obligatorische Schule":
                return school;
            case "Nicht in Ausbildung":
                return not_in_education;
            case "Zwischenlösung":
                return intermediate;
            case "Sekundarstufe II Berufsbildung":
                return coational_education;
            case "Sekundarstufe II Allgemeinbildung":
                return general_education;
            case "Tertiär B":
                return tertiary_b;
            case "Erwerbstätig mit Sek. II-Abschluss":
                return work_dipl;
            case "Erwerbstätig ohne Sek. II-Abschluss":
                return work_no_dipl;
            case "Weder in Ausbildung noch erwerbstätig":
                return no_edu_no_emp;
            case "Tertiär A":
                return tertiary_a;
            default:
                return notsure;
        }
    }

    //set colors for french labels
    else if(lang == "fra")
    {
        switch(d.name)
        {
            case "Scolarité obligatoire":
                return school;
            case "Hors formation":
                return not_in_education;
            case "Solutions intermédiaires":
                return intermediate;
            case "Formation professionnelle sec.II":
                return coational_education;
            case "Formation générale secondaire II":
                return general_education;
            case "Tertiaire B":
                return tertiary_b;
            case "Actif après obtention d‘un diplôme du sec. II":
                return work_dipl;
            case "Actif sans diplôme sec. II":
                return work_no_dipl;
            case "Ni en formation ni actif":
                return no_edu_no_emp;
            case "Tertiaire A":
                return tertiary_a;
            default:
                return notsure;
        }
    }

    //set colors for english labels
    else
    {

        switch(d.name)
        {
            case "9th grade of compulsory school":
                return school;
            case "Not in education or training":
                return not_in_education;
            case "Intermediate solutions":
                return intermediate;
            case "Vocational education and training":
                return coational_education;
            case "General education":
                return general_education;
            case "Tertiary B":
                return tertiary_b;
            case "Economically active with upper sec. diploma":
                return work_dipl;
            case "Economically active without upper sec. diploma":
                return work_no_dipl;
            case "Neither economically active nor in education or training":
                return no_edu_no_emp;
            case "Tertiary A":
                return tertiary_a;
            default:
                return notsure;
        }
    }
}

function appendGradient(id){
    var pathGroup = svg.select('#path' + id);
    var path = pathGroup.select("path");

    var from = document.getElementById("path" + id).__data__.source;
    var to = document.getElementById("path" + id).__data__.target;
    console.log(from)
    console.log(to)


    var pathGradient = pathGroup.append("defs")
        .append("linearGradient")
        .attr("id","grad" + id)
        .attr("gradientUnit","userSpaceOnUse")
        .attr("style","mix-blend-mode: multiply;")
        .attr("x1","0%")
        .attr("x2","100%")
        .attr("y1","0%")
        .attr("y2","0%");

    pathGradient.append("stop")
        .attr("class","from")
        .attr("offset","0%")
        .attr("style", function () {
            var color = setColor(from);
            return "stop-color:" + color + ";stop-opacity:1";
        });

    pathGradient.append("stop")
        .attr("class","to")
        .attr("offset","100%")
        .attr("style",function () {
            var color = setColor(to);
            return "stop-color:" + color + ";stop-opacity:1";
        });

    path.attr("stroke","url(#grad"+id+")")
        .attr("stroke-opacity","0.95");

/*
    pathGradient.transition(t).select(".from")
        .attr("style", function (d) {
            var color = setColor(d.source);
            return "stop-color:" + color + ";stop-opacity:1";
        });
    pathGradient.transition(t).select(".to")
        .attr("style",function (d) {
            var color = setColor(d.target);
            return "stop-color:" + color + ";stop-opacity:1";
        });
*/
}

function removeGradient(id){
     pathGroup = svg.select('#path' + id);
    var path = pathGroup.select("path");

    var pathGradient = pathGroup.select("defs")
        .remove();

    path.attr("stroke","#000")
        .attr("stroke-opacity","0.15");

}

function setGradientColor(bla) {

}