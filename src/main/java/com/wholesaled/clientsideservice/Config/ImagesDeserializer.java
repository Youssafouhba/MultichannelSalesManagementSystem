package com.wholesaled.clientsideservice.Config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.wholesaled.clientsideservice.Model.Images;

public class ImagesDeserializer extends JsonDeserializer<List<Images>> {
    @Override
    public List<Images> deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        JsonNode node = jp.getCodec().readTree(jp);
        List<Images> images = new ArrayList<>();
        if (node.isArray()) {
            for (JsonNode elementNode : node) {
                if (elementNode.isTextual()) {
                    images.add(new Images(elementNode.asText()));
                }
            }
        }
        return images;
    }
}
