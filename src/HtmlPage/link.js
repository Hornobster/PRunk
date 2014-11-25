function setLink(){
    function goBack(){
        document.getElementById('menu').style.display = 'block';
        document.getElementById('createDiv').style.display = 'none';
        document.getElementById('joinDiv').style.display = 'none';
        document.getElementById('joinedDiv').style.display = 'none';
        document.getElementById('settings').style.display = 'none';
    }
    
    document.getElementById('createGame').addEventListener('click', function(){
        document.getElementById('menu').style.display = 'none';
        document.getElementById('createDiv').style.display = 'block';
        document.getElementById('joinDiv').style.display = 'none';
        document.getElementById('joinedDiv').style.display = 'none';
        document.getElementById('settings').style.display = 'none';
    });
    
    document.getElementById('join').addEventListener('click', function(){
        document.getElementById('menu').style.display = 'none';
        document.getElementById('createDiv').style.display = 'none';
        document.getElementById('joinDiv').style.display = 'block';
        document.getElementById('joinedDiv').style.display = 'none';
        document.getElementById('settings').style.display = 'none';
    });
    
    document.getElementById('back1').addEventListener('click', goBack);
    
    document.getElementById('back2').addEventListener('click', goBack);
    
    document.getElementById('back3').addEventListener('click', goBack);
    
    
}