/* 
    Author:     Dan Gallo
    
    Date:       June 2017
    
    Test URL:   http://examples.sencha.com/ExtReact/6.5.0/kitchensink/#/grids/core_features/basic_grid
    
    Purpose:    This test suite for a WebDriver scenario can be used for demonstrating data-driven
                testing capabilities. The test loops through the Excel file's worksheet and ensures 
                that data in the grid matches the Excel sheet.
    
    Notes:      This test suite requires the "exceljs" node module (https://www.npmjs.com/package/exceljs).
                Install node module globally:
                    
                    npm install exceljs -g
                    
                After installing, remember to "npm link <module_name>" on the root "test" folder, so 
                Sencha Test can see the global module.
*/

describe('Spreadsheet', function() {
    var Excel = require('exceljs'),
        grid, worksheetData;
    
    beforeAll(function(done) {
        // Go up 2 folder paths in hierarchy
        contextPath = contextPath.substring(0, contextPath.lastIndexOf('/'));
        contextPath = contextPath.substring(0, contextPath.lastIndexOf('/'));
        
        grid = ST.grid('grid');
        
        var workbook = new Excel.Workbook();
        
        // Read the Excel file
        workbook.xlsx.readFile(contextPath + '/Data/LookupData.xlsx')
            .then(function(file) {
                worksheetData = file.getWorksheet(1).getSheetValues();
                worksheetData.splice(0, 2);
                
                done(); 
            })
            .catch(function(error) {
                debugger;
            });
    });
    
    it('Should match the data from the spreadsheet', function() {
        var rowIndex = 0;
        
        // Loop through Excel worksheet rows, and compare text with grid row's cell content
        for (var row of worksheetData) {
            grid.rowAt(rowIndex ++)
                .cellAt(0)
                .textLike(row[1]);
        }
    });
});

// This is needed to obtain the current folder path of this test suite. This has to be placed here.
var contextPath = module.id;