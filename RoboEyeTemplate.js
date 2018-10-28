/*
-- Simple template filler
-- Author: Ali Mushtaq
-- Website: https://roboeye-tech.com/
*/
'use strict';
window.RoboTemplate = {
    PlaceholderStart: '~',
    PlaceholderEnd: '~',
    parse(template, dataObject, prefix = '', suffix = '') {
        // prechecks
        if (typeof template !== 'string') throw "Template is not string";
        if (template.length < 1) throw "Template is empty";
        let keys = Object.keys(dataObject);
        if (keys.length < 1) throw "No key is defined for replacement.";

        //replace template Placeholders
        let searchPlaceholder;
        keys.forEach(key => {
            searchPlaceholder = this.generateRegExp(key);

            // find the Placeholders in template
            if (searchPlaceholder.test(template)) {
                // replace the placeholder with value/values
                if (typeof (dataObject[key]) === 'object') {

                    //Destructor object
                    const {sub_template, sub_keyword} = dataObject[key];

                    // check for "sub-template" if it exists & not empty
                    if (sub_template === undefined || sub_template.length === 0) {
                        throw "\"sub_template\" is not defined or empty!";
                    }

                    //check for "values" if they exists & not empty
                    if (!Array.isArray(sub_keyword) || sub_keyword.length < 1) {
                        throw "\"sub_keyword\" is not defined or empty!";
                    }
                    console.log('replacing sub-template');
                    let processed_sub_template = '';
                    let temp_sub_template;

                    // parse all sub keywords
                    sub_keyword.forEach(subDataObject => {
                        const aKeywords = Object.keys(subDataObject);
                        // reset template for the next object
                        temp_sub_template = sub_template;
                        // find keyword
                        aKeywords.forEach(keyword => {
                            temp_sub_template = this.regExpReplace(temp_sub_template, keyword, subDataObject[keyword]);
                        });
                        processed_sub_template += temp_sub_template;
                    });
                    // replace sub-template in the main template
                    template = template.replace(searchPlaceholder, processed_sub_template);
                } else {
                    // find and replace in the main template
                    template = template.replace(searchPlaceholder, dataObject[key]);
                }

            }
        });

        // return result
        return template;
    },

    repeatParse(number, template, dataObject = {}, prefix = '', suffix = '') {
        let retTemplate = '';

        for (let x = 0; x < number; x++) {
            dataObject['__repeat__'] = x; // add repeater
            retTemplate += this.parse(template, dataObject, prefix, suffix);
        }
        return retTemplate;
    },

    repeatApply(targetID, number, template, dataObject = {}, prefix = '', suffix = '') {
        const retTemplate = this.repeatParse(number, template, dataObject, prefix, suffix);
        const target = document.querySelector(`#${targetID}`);
        if (target) {
            target.insertAdjacentHTML('afterbegin', retTemplate);
        }
    },

    apply(targetID, template, dataObject, prefix = '', suffix = '') {
        try {
            const retTemplate = this.parse(template, dataObject, prefix, suffix);
            const target = document.querySelector(`#${targetID}`);
            if (target) {
                target.insertAdjacentHTML('afterbegin', retTemplate);
            }
        } catch (e) {
            throw e;
        }
    }
    ,

    regExpGetGroups(regExp, str) {
        const matches = [];
        while (true) {
            const match = regExp.exec(str);
            if (match === null) break;
            // Add capture of group 1 to `matches`
            matches.push(match[1]);
        }
        return matches;
    }
    ,

    regExpReplace(string, pattern, replace) {
        const regex = this.generateRegExp(pattern);
        if (regex.test(string)) {
            return string.replace(regex, replace);
        } else {
            return string;
        }
    }
    ,

    generateRegExp(__key) {
        return new RegExp(`(${this.PlaceholderStart}${__key}${this.PlaceholderEnd})`, 'g');
    }
};