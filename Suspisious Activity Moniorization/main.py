import tkinter as tk
import tkinter.font as font
from in_out import in_out
from motion import noise
from rect_noise import rect_noise
from record import record
from PIL import Image, ImageTk
from find_motion import find_motion
from identify import maincall

window = tk.Tk()
window.title("Motion Tracker")
window.iconphoto(False, tk.PhotoImage(file='mn.png'))
window.configure(bg='orange');
window.geometry('1080x700')

 
frame1 = tk.Frame(window)

label_title = tk.Label(frame1, text="Motion Tracker",fg='blue')
label_font = font.Font(size=35, weight='bold',family='Times New Roman')
label_title['font'] = label_font
label_title.grid(pady=(10,10), column=2)


icon = Image.open('icons/cc1.png')
icon = icon.resize((150,150))
icon = ImageTk.PhotoImage(icon)
label_icon = tk.Label(frame1, image=icon)
label_icon.grid(row=1, pady=(5,10), column=2)

btn1_image = Image.open('icons/mon1.png')
btn1_image = btn1_image.resize((50,50))
btn1_image = ImageTk.PhotoImage(btn1_image)

btn2_image = Image.open('icons/rectangle-of-cutted-line-geometrical-shape.png')
btn2_image = btn2_image.resize((30,30))
btn2_image = ImageTk.PhotoImage(btn2_image)

btn5_image = Image.open('icons/exit.png')
btn5_image = btn5_image.resize((50,50))
btn5_image = ImageTk.PhotoImage(btn5_image)

btn3_image = Image.open('icons/noise1.png')
btn3_image = btn3_image.resize((50,50))
btn3_image = ImageTk.PhotoImage(btn3_image)

btn6_image = Image.open('icons/incognito.png')
btn6_image = btn6_image.resize((50,50))
btn6_image = ImageTk.PhotoImage(btn6_image)

btn4_image = Image.open('icons/rec1.png')
btn4_image = btn4_image.resize((50,50))
btn4_image = ImageTk.PhotoImage(btn4_image)

btn7_image = Image.open('icons/iden1.png')
btn7_image = btn7_image.resize((50,50))
btn7_image = ImageTk.PhotoImage(btn7_image)


# --------------- Button -------------------#
btn_font = font.Font(size=25)
btn1 = tk.Button(frame1, text='Monitor', height=90, width=180, fg='blue',command = find_motion, image=btn1_image, compound='left')
btn1['font'] = btn_font
btn1.grid(row=3, pady=(25,10))

btn2 = tk.Button(frame1, text='Rectangle', height=90, width=180, fg='blue', command=rect_noise, compound='left', image=btn2_image)
btn2['font'] = btn_font
btn2.grid(row=3, pady=(20,10), column=3, padx=(20,5))

btn_font = font.Font(size=25)
btn3 = tk.Button(frame1, text='Noise', height=90, width=180, fg='blue', command=noise, image=btn3_image, compound='left')
btn3['font'] = btn_font
btn3.grid(row=5, pady=(25,10))

btn4 = tk.Button(frame1, text='Record', height=90, width=180, fg='blue', command=record, image=btn4_image, compound='left')
btn4['font'] = btn_font
btn4.grid(row=5, pady=(20,10), column=3,padx=(20,10))


btn6 = tk.Button(frame1, text='In Out', height=90, width=180, fg='blue', command=in_out, image=btn6_image, compound='left')
btn6['font'] = btn_font
btn6.grid(row=5, pady=(20,10), column=2)

btn5 = tk.Button(frame1, height=90, width=180, fg='blue', command=window.quit, image=btn5_image)
btn5['font'] = btn_font
btn5.grid(row=6, pady=(20,10), column=2)

btn7 = tk.Button(frame1, text="identify", fg="blue",command=maincall, compound='left', image=btn7_image, height=90, width=180)
btn7['font'] = btn_font
btn7.grid(row=3, column=2, pady=(20,10))

frame1.pack()
window.mainloop()


