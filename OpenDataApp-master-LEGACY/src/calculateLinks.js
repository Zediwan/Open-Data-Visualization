
/**
 * converts the gender or language value in the person objects to an integer used from @link filterForm
 * for the according property
 */
function convertToInteger(jsonData, type) {
    /* starting with index 0 the details of a person is converted to an integer
     * is connected to the radio buttons !
     *
     * */

    /* 1 = female and 2 = male is the information from the Tree-Data, so that if asked for the gender it begins with 0
     * we have to subtract 1 --> 0 = female , 1 = male*/
    if(type == "gender")
    {
        return jsonData.sex - 1;
    }
    /* 1 = german and 2 = latin, like above to make an ascending integer oder add 1 --> 2 = german, 3 = latin*/
    if(type == "language")
    {
        return jsonData.reg_ling + 1;
    }
    /* 1 = extended academic requirements, 2 = basic ac. req., adding 3 --> 4 = extended , 5 = basic*/
    if(type == "schooltype")
    {
        return jsonData.typ3 + 3;
    }
    /* Status: 1 = low, 2 = middle, 3 = high --> 6 = low, 7 = middle, 8 = high*/
    if(type == "status")
    {
        return jsonData.hiseineu3cat + 5;
    }
    /* Education of the parents: 1 = lower secondary, 2 = upper secondary, 3 = tertiary --> 9 = low, 10 = up, 11 = tert.*/
    if(type == "parents")
    {
        return jsonData.fmedu + 8;
    }
}

/**
 * filter jsonData and fill selected elements into jsonDataFiltered
 */
function filter() {
    jsonDataFiltered = [];
    var form = document.getElementById("filterForm");
    var i;
    var j;
    var length = jsonData.length;
    var selection;

    /*
     * Filter the original Data for every person, based on an selected filter
     *  */
    for (i = 0; i<length; i++)
    {
        for(j = 0; j < 13; j++) {
            if (form.selection[j].checked) {
                selection = j;
            }
        }

        /* If a person falls into the filtered category then push its data in the FilteredArray
         * 12 is used for ALL, but if you want to expand it you have to start by 12 and change the code below and above so
         * that ALL is the last index again, so that it is consistent
         * */
        if(selection == 12 /*index for "all"*/ ||
            selection == convertToInteger(jsonData[i], "gender") ||
            selection == convertToInteger(jsonData[i], "language") ||
            selection == convertToInteger(jsonData[i], "schooltype") ||
            selection == convertToInteger(jsonData[i], "status") ||
            selection == convertToInteger(jsonData[i], "parents"))
        {
            jsonDataFiltered.push(jsonData[i]);
        }
    }
}

/**
 Read each Person and convert information into links
 */
function calculateLinks() {
    var length = jsonDataFiltered.length;
    var index;
    var from = new Array(2);
    var to;

    /* for the calculation of the weigths for that we can break the links down in percentage*/
    t1weigth = 0;
    t2weigth = 0;
    t3weigth = 0;
    t4weigth = 0;
    t5weigth = 0;
    t6weigth = 0;
    t7weigth = 0;
    t8weigth = 0;
    t9weigth = 0;

    //Read each person object and manipulate links accordingly
    for (index = 0; index < length; index++) {
        /*
         * for the obligatory school node (look at the labels.json , all "nodes" are indexed according to the json
         * so for example "Nicht in Ausbildung" exists more than once because it appears in diffrent years, so every of them has
         * a diffrent index), if more nodes and other years are implemented, then this code needs to be expanded!
         * */
        from[0] = 0;

        /*
         * read t1baum, note target of links coming from node 0, note source of links goingt to t2baum
         * we go from node 0 "obligatory school" to one of the 4 nodes of the first survey, so only
         * Nicht in Ausbildung with index 1, Zwischenlösung with index 2 etc.
         * */
        switch (jsonDataFiltered[index].t1baum) {
            case 1:
                to = 1;
                from[1] = 1;
                break;
            case 2:
                to = 2
                from[1] = 2;
                break;
            case 3:
                to = 3;
                from[1] = 3;
                break;
            case 4:
                to = 4;
                from[1] = 4;
                break;
            default:
                to = null;
                from[1] = null;
        }
        /*
         * sum all links together of the first year
         * should a source or target node be empty (because some people didn't answer that year then it will not be included)
         * */
        if (from[0] != null && to != null) {
            linkSize[from[0]][to] += (jsonDataFiltered[index].hr1_kal);
        }


        // same as above but this time it begins with index 5 because thats the first node in the second survey
        switch (jsonDataFiltered[index].t2baum) {
            case 1:
                to = 5;
                from[0] = 5;
                break;
            case 2:
                to = 6;
                from[0] = 6;
                break;
            case 3:
                to = 7;
                from[0] = 7;
                break;
            case 4:
                to = 8;
                from[0] = 8;
                break;
            case 5:
                to = 9;
                from[0] = 9;
                break;
            default:
                to = null;
                from[0] = null;
        }
        if (from[1] != null && to != null) {
            linkSize[from[1]][to] += (jsonDataFiltered[index].hr2_kal);
        }



        switch (jsonDataFiltered[index].t3baum) {
            case 1:
                to = 10;
                from[1] = 10;
                break;
            case 2:
                to = 11;
                from[1] = 11;
                break;
            case 3:
                to = 12;
                from[1] = 12;
                break;
            case 4:
                to = 13;
                from[1] = 13;
                break;
            case 5:
                to = 14;
                from[1] = 14;
                break;
            case 6:
                to = 15;
                from[1] = 15;
                break;
            case 7:
                to = 16;
                from[1] = 16;
                break;
            case 8:
                to = 17;
                from[1] = 17;
                break;
            default:
                to = null;
                from[1] = null;
        }
        if (from[0] != null && to != null) {
            linkSize[from[0]][to] += (jsonDataFiltered[index].hr3_kal);
        }

        switch (jsonDataFiltered[index].t4baum) {
            case 1:
                to = 18;
                from[0] = 18;
                break;
            case 2:
                to = 19;
                from[0] = 19;
                break;
            case 3:
                to = 20;
                from[0] = 20;
                break;
            case 4:
                to = 21;
                from[0] = 21;
                break;
            case 5:
                to = 22;
                from[0] = 22;
                break;
            case 6:
                to = 23;
                from[0] = 23;
                break;
            case 7:
                to = 24;
                from[0] = 24;
                break;
            case 8:
                to = 25;
                from[0] = 25;
                break;
            default:
                to = null;
                from[0] = null;
        }
        if (from[1] != null && to != null) {
            linkSize[from[1]][to] += (jsonDataFiltered[index].hr4_kal);
        }

        switch (jsonDataFiltered[index].t5baum) {
            case 1:
                to = 26;
                from[1] = 26;
                break;
            case 2:
                to = 27;
                from[1] = 27;
                break;
            case 3:
                to = 28;
                from[1] = 28;
                break;
            case 4:
                to = 29;
                from[1] = 29;
                break;
            case 5:
                to = 30;
                from[1] = 30;
                break;
            case 6:
                to = 31;
                from[1] = 31;
                break;
            case 7:
                to = 32;
                from[1] = 32;
                break;
            case 8:
                to = 33;
                from[1] = 33;
                break;
            default:
                to = null;
                from[1] = null;
        }
        if (from[0] != null && to != null) {
            linkSize[from[0]][to] += (jsonDataFiltered[index].hr5_kal);
        }

        switch (jsonDataFiltered[index].t6baum) {
            case 1:
                to = 34;
                from[0] = 34;
                break;
            case 2:
                to = 35;
                from[0] = 35;
                break;
            case 3:
                to = 36;
                from[0] = 36;
                break;
            case 4:
                to = 37;
                from[0] = 37;
                break;
            case 5:
                to = 38;
                from[0] = 38;
                break;
            case 6:
                to = 39;
                from[0] = 39;
                break;
            case 7:
                to = 40;
                from[0] = 40;
                break;
            case 8:
                to = 41;
                from[0] = 41;
                break;
            default:
                to = null;
                from[0] = null;

        }
        if (from[1] != null && to != null) {
            linkSize[from[1]][to] += (jsonDataFiltered[index].hr6_kal);
        }

        switch (jsonDataFiltered[index].t7baum) {
            case 1:
                to = 42;
                from[1] = 42;
                break;
            case 2:
                to = 43;
                from[1] = 43;
                break;
            case 3:
                to = 44;
                from[1] = 44;
                break;
            case 4:
                to = 45;
                from[1] = 45;
                break;
            case 5:
                to = 46;
                from[1] = 46;
                break;
            case 6:
                to = 47;
                from[1] = 47;
                break;
            case 7:
                to = 48;
                from[1] = 48;
                break;
            case 8:
                to = 49;
                from[1] = 49;
                break;
            default:
                to = null;
                from[1] = null;

        }
        if (from[0] != null && to != null) {
            linkSize[from[0]][to] += (jsonDataFiltered[index].hr7_kal);
        }

        switch (jsonDataFiltered[index].t8baum) {
            case 1:
                to = 50;
                from[0] = 50;
                break;
            case 2:
                to = 51;
                from[0] = 51;
                break;
            case 3:
                to = 52;
                from[0] = 52;
                break;
            case 5:
                to = 53;
                from[0] = 53;
                break;
            case 7:
                to = 54;
                from[0] = 54;
                break;
            case 8:
                to = 55;
                from[0] = 55;
                break;
            default:
                to = null;
                from[0] = null;

        }
        if (from[1] != null && to != null) {
            linkSize[from[1]][to] += (jsonDataFiltered[index].hr8_kal);
        }

        switch (jsonDataFiltered[index].t9baum) {
            case 1:
                to = 56;
                from[1] = 56;
                break;
            case 2:
                to = 57;
                from[1] = 57;
                break;
            case 3:
                to = 58;
                from[1] = 58;
                break;
            case 5:
                to = 59;
                from[1] = 59;
                break;
            case 7:
                to = 60;
                from[1] = 60;
                break;
            case 8:
                to = 61;
                from[1] = 61;
                break;
            default:
                to = null;
                from[1] = null;
        }
        if (from[0] != null && to != null) {
            linkSize[from[0]][to] += (jsonDataFiltered[index].hr9_kal);
        }


    }

    /*
     *calculate weight of links
     *for every survey year we collect the total amount of "movement" to get the weight
     *if more nodes and other years are implemented, then this code needs to be expanded!
     * */
    for (i=1; i<5; i++){
        for (j=0; j < 56; j++){
            t1weigth += linkSize[j][i];
        }
    }

    for (i=5; i<10; i++){
        for (j=0; j < 56; j++){
            t2weigth += linkSize[j][i];
        }
    }

    for (i=10; i<18; i++){
        for (j=0; j < 56; j++){
            t3weigth += linkSize[j][i];
        }
    }

    for (i=18; i<26; i++){
        for (j=0; j < 56; j++){
            t4weigth += linkSize[j][i];
        }
    }

    for (i=26; i<34; i++){
        for (j=0; j < 56; j++){
            t5weigth += linkSize[j][i];
        }
    }

    for (i=34; i<42; i++){
        for (j=0; j < 56; j++){
            t6weigth += linkSize[j][i];
        }
    }

    for (i=42; i<50; i++){
        for (j=0; j < 56; j++){
            t7weigth += linkSize[j][i];
        }
    }

    for (i=50; i<56; i++){
        for (j=0; j < 56; j++){
            t8weigth += linkSize[j][i];
        }
    }

    for (i=56; i<62; i++){
        for (j=0; j < 56; j++){
            t9weigth += linkSize[j][i];
        }
    }

    //Break linksize down to %, if more nodes and other years are implemented, then this code needs to be expanded!
    for (i=1; i<5; i++){
        for (j=0; j < 56; j++){
            linkSize[j][i] = linkSize[j][i]/t1weigth*100;
        }
    }

    for (i=5; i<10; i++){
        for (j=0; j < 56; j++){
            linkSize[j][i] = linkSize[j][i]/t2weigth*100;
        }
    }

    for (i=10; i<18; i++){
        for (j=0; j < 56; j++){
            linkSize[j][i] = linkSize[j][i]/t3weigth*100;
        }
    }

    for (i=18; i<26; i++){
        for (j=0; j < 56; j++){
            linkSize[j][i] = linkSize[j][i]/t4weigth*100;
        }
    }

    for (i=26; i<34; i++){
        for (j=0; j < 56; j++){
            linkSize[j][i] = linkSize[j][i]/t5weigth*100;
        }
    }

    for (i=34; i<42; i++){
        for (j=0; j < 56; j++){
            linkSize[j][i] = linkSize[j][i]/t6weigth*100;
        }
    }

    for (i=42; i<50; i++){
        for (j=0; j < 56; j++){
            linkSize[j][i] = linkSize[j][i]/t7weigth*100;
        }
    }

    for (i=50; i<56; i++){
        for (j=0; j < 56; j++){
            linkSize[j][i] = linkSize[j][i]/t8weigth*100;
        }
    }

    for (i=56; i<62; i++){
        for (j=0; j < 56; j++){
            linkSize[j][i] = linkSize[j][i]/t9weigth*100;
        }
    }

    /**
     * Guillotine 4%
     * if a node is smaller than 4% then its links have to be smaller than 4% too, so we give the 63.
     * "invisible" node the links, and empty the normal links
     */

    // for the "value" of a node
    var summe;

    /*
     *for every node index 0 to 61 we calculate its value and then if it is smaller than 4%, we remove it
     *
     * if the node size changes 62 needs to be changed too !
     * it begins by 1 because 0 should be always 100%
     *
     * to remember is that the array linkSize is linkSize[FROM][TO]
     */
    for (i = 1; i < 62; i++){
        summe = 0;
        for (j = 0; j < i; j++){
            summe = summe + linkSize[j][i];
        }

        // 4% guillotine
        if (summe < 4) {
            for (j = 0; j < i; j++) {
                linkSize[j][i] = 0;
            }

            for (j = 0; j < 62; j++) {
                linkSize[62][j] = linkSize[i][j];
                linkSize[i][j] = 0;
            }

        }
    }

    /*
     * now after everything is filtered we can send the links in the right format to customLinks
     * which the helper function in sankey.js uses
     *
     * if more nodes are implemented 63 needs to be changed!
     */
    for (i = 0; i < 63; i++) {
        for (j = 0; j < 63; j++) {
            if (linkSize[i][j] > 0) {
                customLinks.push({ "source": i, "target": j, "value": linkSize[i][j] });
            }
        }
    }
}