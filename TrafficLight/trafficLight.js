

//run script of event:
//$trafficLight.executeMove(this.character(0), xOffset, yOffset, $gameSwitches.value(switchId), stopRegionIds, goMethod);
//for example: $trafficLight.executeMove(this.character(0), -2, 0, $gameSwitches.value(13), [85,86], 3);
//xOffset: -2 means to stop when there is something in event's left 2 tileset. it can be used for event moving left. otherwise, use 2 for event moving right.
//yOffset:like xOffset.
//switchId: need a switch to decide to pass or not.
//stopRegionIds: a array including regionIds which may be crosswalk regions.
//goMethod: number 3 means to move straight.



const $trafficLight = {
    _isTherePlayerInFront: function (char, xFront, yFront) {
        if (char.x + xFront === $gamePlayer.x
            && char.y + yFront === $gamePlayer.y) return true;
        return false;
    },
    _isBlockInFront: function (char, xFront, yFront, stopRegionIds) {
        for (let i = 0; i < $gameMap._events.length; i++) {
            if (!$gameMap._events[i]) continue;

            if(isInStopRegion($gameMap._events[i])) continue;

            if (char.x + xFront === $gameMap._events[i].x
                && char.y + yFront === $gameMap._events[i].y)
                return true;
        }
        return false;

        function isInStopRegion(event){
            return stopRegionIds.indexOf($gameMap.regionId(event.x, event.y)) > -1;
        }
    },
    executeMove: function (char, xFront, yFront, canGo, stopRegionIds, goMethod) {
        if (this._isTherePlayerInFront(char, xFront, yFront)) {
            char._moveType = 0;
            return;
        }
        if (isInStopRegion()) {
            char._moveType = goMethod;
            return;
        }
        if (!canGo && isStopRegionInFront()) {
            char._moveType = 0;
            return;
        }
        if (this._isBlockInFront(char, xFront, yFront, stopRegionIds)) {
            char._moveType = 0;
            return;
        }
        char._moveType = goMethod;

        function isInStopRegion() {
            return stopRegionIds.indexOf($gameMap.regionId(char.x, char.y)) > -1;
        }
        function isStopRegionInFront() {
            return stopRegionIds.indexOf($gameMap.regionId(char.x + xFront, char.y + yFront)) > -1;
        }
    }
};