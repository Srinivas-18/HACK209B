from flask import Flask, request, jsonify
from flask_cors import CORS
from moviepy.video.io.VideoFileClip import VideoFileClip
import os
import assemblyai as aai

# AssemblyAI API key
aai.settings.api_key = "1f33e6a5967d4c90aab5e05f3c34dc53"

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config["MAX_CONTENT_LENGTH"] = 500 * 1024 * 1024  # 500 MB limit

@app.route('/extract_audio_video', methods=['POST'])
def extract_audio_and_analyze():
    try:
        # Check if a video file is provided
        video_file = request.files.get('file')
        if not video_file or video_file.filename == '':
            print("No video file received")
            return jsonify({"error": "No video file provided"}), 400

        # Save the uploaded video file
        video_path = "uploaded_video.mp4"
        video_file.save(video_path)
        print(f"Video saved at {video_path}")

        # Extract audio from the video
        audio_output_path = "extracted_audio.wav"
        try:
            video = VideoFileClip(video_path)
            video.audio.write_audiofile(audio_output_path)
            print(f"Audio extracted to {audio_output_path}")
        except Exception as e:
            print(f"Error extracting audio: {str(e)}")
            return jsonify({"error": "Error processing video", "details": str(e)}), 500

        # Transcribe the audio and analyze sentiment/confidence
        try:
            transcriber = aai.Transcriber()

            # Configure transcription with sentiment analysis
            transcript = transcriber.transcribe(
                audio_output_path,
                config=aai.TranscriptionConfig(
                    sentiment_analysis=True,  # Enable sentiment analysis
                    speaker_labels=True,      # Enable speaker diarization (optional)
                )
            )

            # Check if transcription was successful
            if hasattr(transcript, 'text'):
                transcription_text = transcript.text
                print(f"Transcription successful: {transcription_text}")

                # Analyze sentiment and confidence
                sentiment_score = 0
                confidence_score = 0
                sentiment_results = transcript.sentiment_analysis

                if sentiment_results:
                    # Calculate average sentiment score (positive, neutral, negative)
                    positive_score = sum(
                        [result.confidence for result in sentiment_results if result.sentiment == "POSITIVE"]
                    )
                    negative_score = sum(
                        [result.confidence for result in sentiment_results if result.sentiment == "NEGATIVE"]
                    )
                    neutral_score = sum(
                        [result.confidence for result in sentiment_results if result.sentiment == "NEUTRAL"]
                    )

                    # Normalize sentiment score to a scale of 0-100
                    total_score = positive_score - negative_score
                    sentiment_score = max(0, min(100, (total_score + 1) * 50))  # Scale to 0-100

                    # Calculate average confidence score
                    confidence_score = sum([result.confidence for result in sentiment_results]) / len(sentiment_results) * 100
            else:
                raise ValueError("Transcript object does not have a 'text' attribute")

        except Exception as e:
            print(f"Error during transcription: {str(e)}")
            return jsonify({"error": "Transcription failed", "details": str(e)}), 500

        # Return the response with transcription, sentiment, and confidence scores
        return jsonify({
            "message": "Audio extracted and transcribed successfully",
            "transcription": transcription_text,
            "sentiment_score": round(sentiment_score, 2),  # Sentiment score (0-100)
            "confidence_score": round(confidence_score, 2),  # Confidence score (0-100)
        })

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": "Unexpected error occurred", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)