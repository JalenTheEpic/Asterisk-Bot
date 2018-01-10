var Tasks = function(name){
    
        //!----------------Variable Declarations----------------!
        this.mName = name;
        this.mTasks = []
        //!----------------Function Declarations----------------!
        this.addTask = function(tag,description, days){
            task = {}
            task.tag = tag
            task.description = description
            task.days = days
            task.created = Date()
            this.mTasks.push(task)
        } 

        this.removeTask = function(id){
            if(id >= this.mTasks.length || id < 0){
                //error
            }else{
                this.mTasks.splice(id, 1);
            }
        }

        this.clearTasks = function(){
            this.mTasks = []
        }   
}