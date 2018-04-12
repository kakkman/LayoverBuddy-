import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Chat } from './chat';
import { ChatProvider } from "../../providers/chat/chat";
import { RelativeTimePipe } from "../../pipes/relative-time/relative-time";
import { EmojiPickerComponentModule } from "../../components/emoji-picker/emoji-picker.module";
import { EmojiProvider } from "../../providers/emoji/emoji";

@NgModule({
  declarations: [
    Chat,
    RelativeTimePipe
  ],
  imports: [
    EmojiPickerComponentModule,
    IonicPageModule.forChild(Chat),
  ],
  exports: [
    Chat
  ],
  providers: [
    ChatProvider,
    EmojiProvider
  ]
})
export class ChatModule {
}
