/*
 * rules.js
 *
 * Responsible for reading in supported website url aliases and password
 * requirements.
 *
 * @author Kyle DeFrancia
 */
var greystash = greystash || {};


/*
 * getRule()
 *
 * Get password rules for a supported website.
 *
 * @param url The url to get the rule for
 *
 * @return a rule object
 */
greystash.getRule = function(url) {
    greystash.rules = greystash.rules || greystash.initRules();

    var entry;
    // check each site listed in the rules
    for (var site in greystash.rules) {
        // if the url is associated with this site
        if (greystash.rules[site].urls.indexOf(url) > -1) {
            entry = greystash.rules[site];
            break;
        }
    }

    if (entry == null) {
        console.log('ERROR: rule entry for ' + url + ' not found');
        return null;
    }

    return entry;
};


/*
 * initCustomRules()
 *
 * Get any custom website rules added by the user.
 *
 * @param callback Function that looks like: function(rules){...}
 *              The rules object will have the new custom sites in it.
 * @param rules Object to add rules to
 */
greystash.initCustomRules = function(callback, rules) {
    // for now the generic rule will limit passwords to a length of 14
    // this is the shortest max length associated with any Greystash supported sites.
    var genRule = /^(?=.{6,14}$)(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\^*#!@$%&()]).*$/;

    greystash.getCustomSites(function(sites) {
        console.log('Checking for custom sites to add...', sites);
        // make sure we are dealing with an array of strings
        if (Object.prototype.toString.call(sites) === '[object Array]') {
            var numCustom = 0;

            sites.forEach(function(customSite) {
                rules['custom' + numCustom] = {
                    urls: [customSite],
                    rule: genRule
                };
                numCustom++;
            });

            console.log('done adding custom rules.', rules)
        } else {
            console.log('no custom sites to add!');
        }

        callback(rules);
    });
};
    

/*
 * initRules()
 *
 * This method runs when the script loads and makes the mathching urls,
 * password rules, and max password length of all supported websites available
 * in the greystash.rules object.
 *
 * A rule object must contain:
 *   key: urls
 * value: array of canonical URLs
 * 
 *   key: rule
 * value: regular expression
 *
 * Optionally a rule may also contain:
 *   key: max_len
 * value: integer value 
 *
 * This function also reinitializes the stale table.
 *
 * @return the rules object containg all supported website rules
 */
greystash.initRules = function() {
    var rules = {};

    //**** SOCIAL *************************************************************

    rules['reddit'] = {
        urls: ['reddit.com'],
        rule: /^.{3,}$/
    };

    rules['facebook'] = {
        urls: ['facebook.com'],
        rule: /^.{6,}$/,
        max_len: 1000
    };

    rules['twitter'] = {
        urls: ['twitter.com'],
        rule: /^.{6,}$/
    };

    //**** ONLINE SERVICES ****************************************************

    rules['google'] = {
        urls: ['google.com'],
        rule: /^.{8,}$/
    };

    rules['microsoft'] = {
        urls: ['live.com'],
        rule: /^(?=.{8,16}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[\^\-*#~!@$%&()_+=`]).*$/,
        max_len: 16
    };

    //**** SHOPPING ***********************************************************
    
    rules['ebay'] = {
        urls: ['ebay.com'],
        rule: /^(?=.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[\^\-*#~!@$%&()_+=`]).*$/
    };

    rules['amazon'] = {
        urls: ['amazon.com'],
        rule: /^.{6,128}$/,
        max_len: 128
    };

    //**** Random **************************************************************

    rules['netflix'] = {
        urls: ['netflix.com'],
        rule: /^(?=.{8,14}$)(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\^*#!@$%&()]).*$/,
        max_len: 14
    };

    rules['pandora'] = {
        urls: ['pandora.com'],
        rule: /^(?=.{8,20}$)(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$/,
        max_len: 20
    };


    //**** SCHOOLS ************************************************************

    rules['pilots'] = {
        urls: ['up.edu'],
        rule: /^(?=.{8,}$)(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\^\-*#~!@$%&()_+=`]).*/
    };

    greystash.initCustomRules(function(newRules) {
        // finish creating rules
        greystash.rules = newRules;
        greystash.initStaleTable();
    }, rules);

    return rules;
};
greystash.initRules();

