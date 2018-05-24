var mapEvent = (function () {
    var mapEditor = {};


    function AMaps() {
        this.map = new AMap.Map('container', {

            resizeEnable: true,
            center: [104.064, 30.6594], //地图中心点
            zoom: 10, //地图显示的缩放级别

        });
        var that = this;
        this.map.plugin(["AMap.MapType"], function () {
            var type = new AMap.MapType({
                defaultType: 1, //使用2D地图
                showTraffic: true,
                showRoad: false
            });
            that.map.addControl(type);
        });

        this.editor = {
            beginNum: 0,
            clickListener: null,
            beginPoints: [],
            beginMarks: [],
            polygonEditor: null,
            resPolygon: [],
            endNum: 3,
            isOpen: false
        };
    }
    AMaps.prototype = {
        that: this,
        saveEditor: function () {
            this.editor.polygonEditor.close();
            console.log(this.editor.resPolygon);
            this.editor.resPolygon.length = 0;
            layer.msg('保存成功！'); 
        },
        openEditor: function () {
            if (!this.editor.isOpen)
                this.editor.polygonEditor.open();
            else
                console.log('已打开');
        },
        closeEditor: function () {
            if (this.editor.isOpen)
                this.editor.polygonEditor.open();
        },
        restEditor: function () {

            this.map.remove(this.editor.beginMarks);
            this.map.remove(this.editor.polygon);
            this.editor.polygonEditor.close();
            this.map.remove(this.editor.polygonEditor);

            this.editor = {
                beginNum: 0,
                clickListener: null,
                beginPoints: [],
                beginMarks: [],
                polygonEditor: null,
                resPolygon: [],
                endNum: 3,
                isOpen: false
            };
            var that = this;
            this.editor.clickListener = AMap.event.addListener(this.map, "click", function (e) {
                that.mapOnClick(e, that)
            });
        },
        initEditor: function (endNum) {
            var that = this;
            this.editor.clickListener = AMap.event.addListener(this.map, "click", function (e) {
                that.mapOnClick(e, that)
            });
            this.editor.endNum = endNum || 3;
        },
        mapOnClick: function (e, that) {

            that.editor.beginMarks.push(that.addMarker(e.lnglat));
            that.editor.beginPoints.push(e.lnglat);
            that.editor.beginNum++;
            if (that.editor.beginNum == that.editor.endNum) {
                AMap.event.removeListener(that.editor.clickListener);
                that.editor.polygon = that.createPolygon(that.editor.beginPoints);
                that.createEditor(that.editor.polygon);
                that.map.remove(that.editor.beginMarks);
                that.editor.isOpen = true;
                // clearMarks();
            }
        },
        // 实例化点标记
        addMarker: function (lnglat) {

            var marker = new AMap.Marker({
                icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: lnglat
            });
            marker.setMap(this.map);
            return marker;
        },
        createPolygon: function (arr) {
            var polygon = new AMap.Polygon({
                map: this.map,
                path: arr,
                strokeColor: "#0000ff",
                strokeOpacity: 1,
                strokeWeight: 3,
                fillColor: "#f5deb3",
                fillOpacity: 0.35
            });
            return polygon;
        },
        createEditor: function (polygon) {
            this.editor.polygonEditor = new AMap.PolyEditor(this.map, polygon);
            this.editor.polygonEditor.open();
            this.editor.isOpen = true;
            var that = this;
            AMap.event.addListener(this.editor.polygonEditor, 'end', function (res) {
                that.polygonEnd(res, that)
            });
            // return polygonEditor;
        },
        polygonEnd: function (res, that) {
            that.editor.resPolygon.push(res.target);
            console.log(res.target.getPath());
        }

    }

    var maps = new AMaps();
    return {
        openEditor: function () {
            maps.openEditor();
        },
        closeEditor: function () {
            maps.closeEditor();
        },
        restEditor: function () {
            maps.restEditor();
        },
        initEditor: function () {
            maps.initEditor();
        },
        saveEditor: function () {
            maps.saveEditor();
        }
    }

    // return new AMaps();

})();