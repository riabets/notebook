<template>
    <div class="wrapper">
        <div class="add_notes_section">
            <h3>Add note</h3>
            <textarea name="notesfield" id="notesField" cols="80" rows="10" placeholder="Type your note here" v-model="notesTextInput"></textarea>
            <button id="saveNote" @click="addTextInput">Save note</button>
        </div>
        <div class="export_notes">
            <p class="export_notes_text">Export notes</p>
            <a href="#" id="exportNotesText" @click="exportNotesJson()">Export</a><br>

            <p class="import_notes_text">Import notes</p>
            <input type="file" id="importNotesFile" value="Import Notes"><br>
            <button id="importNotesButton" @click="importNotesJson()">Import</button>
        </div>
        <div class="sort">
            <button class="sort_button" @click="sortByContent(-1, 1)">ABC</button>
            <button class="sort_button" @click="sortByContent(1, -1)">CBA</button>
            <button class="sort_button" @click="sortByDate()">Date</button>
        </div>
        <div class="notes_section">
            <h3>Your current notes</h3>
            
            <ul id="currentNotes" class="notes_list">
                <li v-for="item in notesAll">
                    <p>{{ item.text }}</p>
                    <!-- <p>{{ item.id }}</p> -->
                    <p>{{ item.reminderDate }}</p>
                    <div class="notes_form">
                        <input id="dateInput" type="datetime-local" name="meeting-time" v-model="reminderDate"><br>
                        <button @click="reminderSetting(item.id)" class="reminderButton">Set reminder</button>
                    </div>
                    <button @click="removeTextStorage(item.id)" class="deleteNote">X</button>
                    <button @click="nonPersistentNotification(item.reminderDate, item.text)">Get Notification</button>
                </li>
            </ul>

        </div>
    </div>
</template>
<script>
// import { setTimeout } from 'timers';
import moment from 'moment';

/* eslint-disable */
export default {
    data(){
        return{
            notesTextInput: null,
            notesAll: [],
            notesText: [],
            notesId: [],
            notesReminder:[],
            reminderDate: '2019-06-20T00:00',
        }
    },
    methods: {
        addTextInput(){
            if (!this.notesTextInput){
                return;
            }
            const randomId = () =>{
                return '_' + Math.random().toString(36).substr(1,20) + '_' + Math.random()*1000;
            }
            this.notesAll.push({id: randomId(), text: this.notesTextInput});
            this.notesTextInput = '';
            this.saveTextStorage();
        },
        removeTextStorage(x){
            let deletedItem;
            deletedItem = this.notesAll.map(function(e) { return e.id; }).indexOf(x);
            if (deletedItem > -1){
                this.notesAll.splice(deletedItem, 1);
            }
            this.saveTextStorage();
        },
        saveTextStorage(){
            const textStorage = JSON.stringify(this.notesAll);
            localStorage.setItem('notes', textStorage);
        },
        reminderSetting(r){
            let itemReminder;
            itemReminder = this.notesAll.map(function(e){return e.id}).indexOf(r);
            let itemReminderIndex = this.notesAll[itemReminder];

            itemReminderIndex.reminderDate = this.reminderDate;
            this.saveTextStorage();
        },
        sortByContent(x, y){
            this.notesAll = this.notesAll.sort(function( a, b ){
                if (a.text < b.text){
                    return x;
                } else if (a.text > b.text){
                    return y;
                }
                return 0;
            });
            this.saveTextStorage();
        },
        sortByDate(){
            let dateSort = this.notesAll.sort((a, b) => {
                if(a.reminderDate === undefined || b.reminderDate === undefined){
                    return;
                }
                if(a.reminderDate < b.reminderDate){
                    return -1;
                } else if (a.reminderDate > b.reminderDate){
                    return 1;
                }
                return 0;
            });
            this.saveTextStorage();
        },
        // ************ Export to json
        exportNotesJson(){
            let notesToExport = JSON.stringify(this.notesAll);
            let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(notesToExport);
            let exportFile = 'notes.json';
            const exportNotesLink = document.getElementById("exportNotesText");

            exportNotesLink.setAttribute('href', dataUri);
            exportNotesLink.setAttribute('download', exportFile);
        },
        // ************ Import from json
        importNotesJson(){
            var files = document.getElementById("importNotesFile").files;
            if (files.length <= 0) {
                return false;
            }
            var fileReader = new FileReader();
            let self = this;
            fileReader.onload = function(event){
                var result = JSON.parse(event.target.result);
                result.forEach((item) => {
                    const randomId = () =>{
                        return '_' + Math.random().toString(36).substr(1,20) + '_' + Math.random()*1000;
                    }
                    self.notesAll.push({id: randomId(), text: item.text, reminderDate: item.reminderDate});
                    const importedText = JSON.stringify(self.notesAll);
                    localStorage.setItem('notes', importedText);
                })
            }
            fileReader.readAsText(files.item(0));
        },
        nonPersistentNotification(dateForNote, textOfNote) {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    try {
                        var notification = new Notification("Reminder:", { body: textOfNote, icon: 'https://sample-videos.com/img/Sample-jpg-image-50kb.jpg' });
                    } catch (err) {
                        console.log('Notification API error: ' + err);
                    }
                }
            });
            if (!('Notification' in window)) {
                alert('Notification API not supported!');
                return;
            }
        },

    },
    mounted(){
        if (localStorage.getItem('notes')){
            this.notesAll = JSON.parse(localStorage.getItem('notes'));
        };
    },
}
</script>
<style src="./index.css"></style>
