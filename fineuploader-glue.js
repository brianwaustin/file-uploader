/**
 * Sets up a Fine Uploader S3 jQuery UI instance, ensures files are saved under a "directory" in the bucket
 * bearing the logged-in user's name, provides a link to view the uploaded file after it has reached the bucket
 * and asks AWS for new credentials before those expire.
 */
$(function() {
    var bucketUrl = "https://file-drop-cloudshock--io.s3.amazonaws.com",
        updateCredentials = function(error, data) {
            if (!error) {
                $('#uploader').fineUploaderS3("setCredentials", s3DemoGlobals.getFuCredentials(data));
            }
        },
        hideUploader = function() {
            $("#uploader").hide();
        };

    $("#uploader").fineUploaderS3({
        debug: true,
        request: {            
            endpoint: bucketUrl,
            params: {
                sourceType: "FileUploader",
                uploadDate: function(){
                   return (new Date()).toISOString.substring(0,19).replace('T', ' ') + "')";                    
                },
                tenantId: s3DemoGlobals.tenantId,
                agentId: s3DemoGlobals.agentId,
                description: s3DemoGlobals.descriptions
            }
        },
        objectProperties: {
            // Since we want all items to be publicly accessible w/out a server to return a signed URL
            acl: "public-read",

            /* The key for each file will follow this format: {USER_NAME}/{UUID}.{FILE_EXTENSION} */
            key: function(id) {
                var filename = this.getName(id),
                    uuid = this.getUuid(id);

                /* Strip dashes from UID */
                uuid = uuid.replace(new RegExp('-', 'g'), "");

                /* Handle .jpegs */
                var extension = qq.getExtension(filename).toLowerCase();
                if(extension == "jpeg") extension="jpg";

                return qq.format("{}/{}.{}", s3DemoGlobals.userName, uuid, extension);
            }
        },
        chunking: {
            enabled: true
        },
        resume: {
            enabled: true
        },
        /* Restrict file count and size (150 files, 99 Mb each) */
        validation: {
            allowEmpty: false,
            itemLimit: 1000,
            sizeLimit: 99000000
        },
        retry: {
            enabledAuto: false
        },
        thumbnails: {
            placeholders: {
                notAvailablePath: "not_available-generic.png",
                waitingPath: "waiting-generic.png"
            }
        },
        callbacks:{
            onManualRetry: function(id, name){
                console.log("Retry: " + id + " name: " + name);
            },
            onComplete: function(succeeded, failed){
                console.log("succeeded: " + succeeded.length + " failed: " + failed.length);
            }
        }
    })
        .on('complete', function(event, id, name, response, xhr) {
            var $fileEl = $(this).fineUploaderS3("getItemByFileId", id),
                $viewBtn = $fileEl.find(".view-btn"),
                key = $(this).fineUploaderS3("getKey", id);

            // Add a "view" button to access the uploaded file in S3 if the upload is successful
            if (response.success) {
                $viewBtn.show();
                $viewBtn.attr("href", bucketUrl + "/" + key);
            }
        })
        .on("credentialsExpired", function() {
            var promise = new qq.Promise();

            // Grab new credentials
            s3DemoGlobals.assumeRoleWithWebIdentity({
                callback: function(error, data) {
                    if (error) {
                        promise.failure("Failed to assume role");
                    }
                    else {
                        promise.success(s3DemoGlobals.getFuCredentials(data));
                    }
                }
            });

            return promise;
        });

    s3DemoGlobals.updateCredentials = updateCredentials;

    $(document).on("tokenExpired.s3Demo", hideUploader);
    $(document).on("tokenReceived.s3Demo", function() {
        $("#uploader").show();
    });
    $(document).trigger("tokenExpired.s3Demo");
});
