(function () {
    let _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        if (command === "storeTraceOn") {
            $gameSystem.storeTraceOn = makeStoreObj();
            $gameSystem.storeTraceOn.switches.getSwitch();
            $gameSystem.storeTraceOn.variables.getVariable();
            $gameSystem.storeTraceOn.actorsSkills.getActorSkill(1); //1 means first actor
            $gameSystem.storeTraceOn.actorsStates.getActorState(1); //1 means first actor

            // args.forEach(actorIdString =>{
            //     $gameSystem.storeTraceOn.actorsSkills.getActorSkill(Number(actorIdString));
            //     $gameSystem.storeTraceOn.actorsStates.getActorState(Number(actorIdString));
            // });
        }

        if (command === "restoreTraceOn") {
            if (!$gameSystem.storeTraceOn) return;

            $gameSystem.storeTraceOn.switches.restoreSwitch();
            $gameSystem.storeTraceOn.variables.restoreVariable();
            $gameSystem.storeTraceOn.actorsSkills.restoreActorSkill(1); //1 means first actor
            $gameSystem.storeTraceOn.actorsStates.restoreActorState(1); //1 means first actor

            // args.forEach(actorIdString =>{
            //     $gameSystem.storeTraceOn.actorsSkills.getActorSkill(Number(actorIdString));
            //     $gameSystem.storeTraceOn.actorsStates.getActorState(Number(actorIdString));
            // });
        }

    };

    function makeStoreObj() {
        const result = {
            switches: makeSwitchDictionary(),
            variables: makeVariableDictionary(),
            actorsSkills: makeSkillDictionary(),
            actorsStates: makeStateDictionary()
        };
        return result;
    }

    function makeSwitchDictionary() {
        const result = {
            switches: []
        };

        result.getSwitch = function () {
            this.switches = [];
            $gameSwitches._data.forEach((v, k) => {
                this.switches[k] = v;
            });
        };

        result.restoreSwitch = function () {
            $gameSwitches._data = [];
            this.switches.forEach((v, k) => {
                $gameSwitches._data[k] = v;
            });
        };

        return result;
    }

    function makeVariableDictionary() {
        const result = {
            variables: []
        };

        result.getVariable = function () {
            this.variables = [];
            $gameVariables._data.forEach((v, k) => {
                this.variables[k] = v;
            });
        };

        result.restoreVariable = function () {
            $gameVariables._data = [];
            this.variables.forEach((v, k) => {
                $gameVariables._data[k] = v;
            });
        };

        return result;
    }



    function makeSkillDictionary() {
        const result = {};

        //notice: actorId could be origin from 1 rather than 0!
        result.getActorSkill = function (actorId) {
            this[actorId] = {
                skillList: new Map()
            };

            $gameActors.actor(actorId).skills().forEach(skill => {
                this[actorId].skillList.set(skill.id, true);
            });
        };

        result.restoreActorSkill = function (actorId) {
            $gameActors.actor(actorId).skills().forEach(skill => {
                $gameActors.actor(actorId).forgetSkill(skill.id);
            });
            this[actorId].skillList.forEach((v, k) => {
                $gameActors.actor(actorId).learnSkill(k);
            });
        };
        return result;
    }

    function makeStateDictionary() {
        const result = {};

        //notice: actorId could be origin from 1 rather than 0!
        result.getActorState = function (actorId) {
            this[actorId] = {
                stateList: new Map()
            };

            $gameActors.actor(actorId).states().forEach(state => {
                this[actorId].stateList.set(state.id, true);
            });
        };

        result.restoreActorState = function (actorId) {
            $gameActors.actor(actorId).states().forEach(state => {
                $gameActors.actor(actorId).eraseState(state.id);
                //$gameActors.actor(actorId).removeState(state.id); sometimes fail
            });
            $gameActors.actor(actorId).refresh();
            this[actorId].stateList.forEach((v, k) => {
                $gameActors.actor(actorId).addNewState(k);
                // $gameActors.actor(actorId).addState(k); sometimes fail
            });
            $gameActors.actor(actorId).refresh();
        };
        return result;
    }



})();