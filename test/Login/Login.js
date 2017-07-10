'use strict';

/* 
    Author:     Dan Gallo
    
    Date:       June 2017
    
    Test URL:   https://se.sencha.com/AssetRegister
    
    Purpose:    This test suite for a WebDriver scenario can be used for demonstrating data-driven
                testing capabilities. The test loops through credentials in the Excel file's worksheet
                and logs in as each of those users in the web app.
    
    Notes:      This test suite requires the "exceljs" node module (https://www.npmjs.com/package/exceljs).
                Install node module globally:
                    
                    npm install exceljs -g
                    
                After installing, remember to "npm link <module_name>" on the root "test" folder, so 
                Sencha Test can see the global module.
*/

describe('Login', function() {
    var Excel = require('exceljs'),
        credentials, loginDetails;
    
    var Page = {
        /*
            Login screen elements
        */
        emailField: function() {
            return ST.element('@email');  
        },
        passwordField: function() {
            return ST.element('@password');  
        },
        submitButton: function() {
            return ST.element('@submit');
        },
        resetButton: function() {
            return ST.element('@reset');  
        },
        errorText: function() {
            return ST.element('@errors');
        },
        logoutButton: function() {
            return ST.button('[reference=logout]');
        },
        loginLink: function() {
            return ST.element('@login');  
        }
    };

    var timeToWait = 1000;
    
    beforeAll(function(done) {
        // Go up 2 folder paths in hierarchy
        contextPath = contextPath.substring(0, contextPath.lastIndexOf('/'));
        contextPath = contextPath.substring(0, contextPath.lastIndexOf('/'));
        
        var workbook = new Excel.Workbook();
        
        workbook.xlsx.readFile(contextPath + '/Data/LookupData.xlsx')
            .then(function(file) {
                loginDetails = file.getWorksheet('LoginDetails').getSheetValues();
                loginDetails.splice(0, 2);
                
                done(); 
            })
            .catch(function(error) {
                debugger;
            });
    });
    
    it('Should login as each user when valid credentials are supplied', function() {
        // Loop through user credentials in Excel worksheet and attempt to login as each user
        for (let user of loginDetails) {
            // Login
            Page.emailField()
                .focus()
                .type(user[1]);
            
            Page.passwordField()
                .focus()
                .type(user[2]);
                
            Page.submitButton()
                .click()
                .wait(timeToWait)
                .getUrl(function(url) {
                    expect(url).toContain('Default.aspx'); 
                })
                .wait(timeToWait);
                
                
            // Logout
            Page.logoutButton()
                .click()
                .wait(timeToWait)
                .getUrl(function(url) {
                    expect(url).toContain('Logout.aspx');
                })
                .wait(timeToWait);


            // Navigate back to login screen
            Page.loginLink()
                .click()
                .wait(timeToWait);
        }
    });
});

// This is needed to obtain the current folder path of this test suite. This has to be placed here.
var contextPath = module.id;