function PathFinderAlgorithm() {
    this.path = new Map();
}

// retrive the actual path from the Map Object
PathFinderAlgorithm.prototype.getPath = function (node=null) {
    let path = [];
    while (node != null && this.path.has(node)) {
        path.unshift(node);
        node = this.path.get(node);
    }
    return path;
}


PathFinderAlgorithm.prototype.drawPath = function (path){
    if (path.length) {
        path.shift().addClass("path-node");
        setTimeout(this.drawPath.bind(this), 50, path);
    }
}

PathFinderAlgorithm.prototype.retracePath = function (path) {
    for (let node of path) {
        node.addClass("retraced-path-node");
    }
}


// notifier 

function get(object, key, default_=null) {
    return (key in object) ? object[key] : default_;
}


const Template = 
`<div data-notify="container" class="col-12 col-sm-9 col-md-6 col-lg-4 alert alert-{0} d-flex" role="alert"> 
    <button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button> 
    <div class="d-flex align-items-center">
        <button class="btn btn-sm btn-circle btn-{0} mr-2">
            <i data-notify="icon"></i>
        </button>
        <strong data-notify="title">{1}</strong>
        <span data-notify="message" id="task-message">{2}</span> 
    </div>

    <div class="progress progress-wrapper" data-notify="progressbar"> 
        <div id='progress-bar' class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">&nbsp;</div> 
    </div> 

    <a href="{3}" target="{4}" data-notify="url"></a> 
</div>`


function Notification(params={}) {
    this.settings = {
        element: 'body',
        position: null,
        type: get(params, 'type', 'info'),
        allow_dismiss: true,
        newest_on_top: true,
        showProgressbar: get(params, 'showProgressbar', false),
        placement: {from: "top", align: "right"},
        offset: 10,
        spacing: 10,
        z_index: 1031,
        delay: get(params, 'delay', 5000),
        timer: get(params, 'timer', 1000),
        url_target: get(params, 'url_target', '_blank'),
        mouse_over: get(params, 'mouse_over', 'pause'),
        animate: {enter: 'animated fadeInDown', exit: 'animated fadeOutUp'},
        onShow: get(params, 'onShow'),
        onShown: get(params, 'onShown'),
        onClose: get(params, 'onClose'),
        onClosed: get(params, 'onClosed'),
        icon_type: get(params, 'icon_type', 'class'),
        template: get(params, 'template', Template),
    }
}

Notification.prototype.success = function (options={}) {
    options.icon = "fas fa-check";
    this.settings.type = "success";
    console.log(this.settings);
    $.notify(options, this.settings);
}


Notification.prototype.info = function (options={}) {
    options.icon = "fas fa-info";
    this.settings.type = "info";
    $.notify(options, this.settings);
}

Notification.prototype.error = function (options={}) {
    options.icon = "fas fa-bug";
    this.settings.type = "danger";
    $.notify(options, this.settings);
}

