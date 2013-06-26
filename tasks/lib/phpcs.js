/*
 * grunt-phpunit
 * https://github.com/SaschaGalley/grunt-phpunit
 *
 * Copyright (c) 2013 Sascha Galley
 * http://xash.at
 * Licensed under the MIT license.
 */
'use strict';

// External libs.
var path = require('path');
var exec = require('child_process').exec;

exports.init = function(grunt) {

    var exports  = {},
        defaults = {
            // Default options
            bin: 'phpcs',
            extensions: false,
            ignore: false,
            reportType: false,
            reportFile: false,
            severity: false,
            errorSeverity: false,
            warningSeverity: false,
            standard: false,
            verbose: false
        },
        cmd    = null,
        done   = null,
        config = {};

    /**
     * Builds phpunit command
     *
     * @return string
     */
    var buildCommand = function(dir) {

        var cmd = path.normalize(config.bin);

        if (config.extensions) {
            // A comma separated list of file extensions to check
            cmd += ' --extensions=' + config.extensions;
        }

        if (config.ignore) {
            // A comma separated list of patterns to ignore files and directories.
            cmd += ' --ignore=' + config.ignore;
        }

        if (config.severity) {
            // The minimum severity required to display an error or warning
            cmd += ' --severity=' + config.severity;
        }

        if (config.errorSeverity) {
            // The minimum severity required to display an error or warning
            cmd += ' --error-severity=' + config.errorSeverity;
        }

        if (config.warningSeverity) {
            // The minimum severity required to display an error or warning
            cmd += ' --warning-severity=' + config.warningSeverity;
        }

        if (config.standard) {
            // Define the code sniffer standard.
            cmd += ' --standard=' + config.standard;
        }

        if (config.reportType) {
            // Set the type of report to output
            var reportType = grunt.option('report')? grunt.option('report'): config.reportType;
            cmd += ' --report=' + reportType;
        }

        if (config.reportFile) {
            // Define the code sniffer standard.
            cmd += ' --report-file=' + config.reportFile;
        }

        if (config.verbose === true) {
            // Output more verbose information.
            cmd += ' -v';
        }

        return cmd;
    };

    /**
     * Setup task before running it
     *
     * @param Object runner
     */
    exports.setup = function(runner) {

        var dir = path.normalize(runner.data.dir);
        config  = runner.options(defaults);

        // Load any config passed from CLI
        if (grunt.option('extensions')) {
            config.extensions = grunt.option('extensions');
        }

        if (grunt.option('ignore')) {
            config.ignore = grunt.option('ignore');
        }

        if (grunt.option('severity')) {
            config.severity = grunt.option('severity');
        }

        if (grunt.option('error-severity')) {
            config.errorSeverity = grunt.option('error-severity');
        }

        if (grunt.option('warning-severity')) {
            config.warningSeverity = grunt.option('warning-severity');
        }

        if (grunt.option('standard')) {
            config.standard = grunt.option('standard');
        }

        if (grunt.option('report')) {
            config.reportType = grunt.option('report');
        }

        if (grunt.option('report-file')) {
            config.reportFile = grunt.option('report-file');
        }

        if (grunt.option('verbose')) {
            config.verbose = true;
        }
        cmd     = buildCommand(dir) + ' ' + dir;

        grunt.log.writeln('Starting phpcs (target: ' + runner.target.cyan + ') in ' + dir.cyan);
        grunt.verbose.writeln('Exec: ' + cmd);

        done    = runner.async();
    };

    /**
     * Runs phpunit command with options
     *
     */
    exports.run = function() {

        exec(cmd, function(err, stdout, stderr) {

            if (stdout) {
                grunt.log.write(stdout);
            }

            if (err) {
                grunt.fatal(err);
            }
            done();
        });
    };

    return exports;
};
