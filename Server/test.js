/*jslint browser:true, for:true, devel: true */ /*global  require  */

function getNewestFile(dir, regexp) {
    "use strict";

    var fs = require("fs");
    var path = require("path");
    var newest = null;
    var files = fs.readdirSync(dir);
    var i;
    var f_time;
    var newest_time;

    for (i = 0; i < files.length; i += 1) {
        if (regexp.test(files[i])) {
            if (newest === null) {
                newest = files[i];
                newest_time = fs.statSync(path.join(dir, newest)).mtime.getTime();
            } else {
                f_time = fs.statSync(path.join(dir, files[i])).mtime.getTime();
                if (f_time > newest_time) {
                    newest = files[i];
                    newest_time = f_time;
                }
            }
        }
    }

    if (newest !== null) {
        return (path.join(dir, newest));
    }
    return null;
}

var cert = getNewestFile("/home/grrdahos/ssl/certs", new RegExp("^autodiscover_grrd_a2hosted_com_.*.crt$"));
var key = getNewestFile("/home/grrdahos/ssl/keys", new RegExp("^" + cert.substring(56, 67) + ".*.key$"));
console.log("**********************************************");
console.log("the newest key-file is:");
console.log(key);
console.log("the newest cert-file is:");
console.log(cert);
console.log("**********************************************");