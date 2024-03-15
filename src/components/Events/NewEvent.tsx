import { Link, useNavigate } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useMutation } from "@tanstack/react-query";
import { createNewEvent, queryClient } from "../../util/http.util.js";
import { NewEventData, ResError } from "../../models/common.model.js";
import ErrorBlock from "../UI/ErrorBlock.js";

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent, // unlike useQuery, mutationFn is not called automatically; you need to call it separately,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"], // invalidates all query with this key as a part of it
        // exact: true,  // if written, it will invalidate the exact matching query, not all
      });
      navigate("/events");
    },
  });

  function handleSubmit(formData: NewEventData) {
    mutate({ event: formData }); // object format is set in backend app.js file
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting ..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Something went wrong"
          message={(error as ResError).info?.message}
        />
      )}
    </Modal>
  );
}
