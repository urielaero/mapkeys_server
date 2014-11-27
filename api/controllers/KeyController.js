/**
 * KeyController
 *
 * @description :: Server-side logic for managing keys
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    deleteIP:function(req,res){
        var form = req.params.all();
        if(form.ip){
            Key.destroy({ip:form.ip},function(err){
                if(err) return res.json(0);
                return res.json(1); 
            });
        }
    }
};

