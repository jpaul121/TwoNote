from rest_framework import serializers

from .models import Note, Notebook

class NoteSerializer(serializers.ModelSerializer):
  class Meta:
    model = Note
    fields = [ 'id', 'title', 'content', 'date_modified', 'date_created' ]

class NotebookSerializer(serializers.ModelSerializer):
  notes = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
  
  class Meta:
    model = Notebook
    fields = [ 'id', 'name', 'notes', 'date_modified', 'date_created' ]