import { Link, useNavigate, useParams } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent, queryClient, updateEvent } from "../../util/http.util.js";
import LoadingIndicator from "../UI/LoadingIndicator.js";
import ErrorBlock from "../UI/ErrorBlock.js";
import { ResError } from "../../models/common.model.js";
import { useState } from "react";

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editEventKey] = useState(["events", { id }]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: editEventKey,
    queryFn: (opts) => fetchEvent({ id, signal: opts.signal }),
  });

  const updateMtn = useMutation({
    mutationFn: updateEvent,

    // called the same time when the `mutationFn` is called.
    onMutate: async (
      updatedData // this will contain the same data passed in the `mutate` call
    ) => {
      // console.log({ updatedData });

      const previousData = queryClient.getQueryData(editEventKey); // to be used to roll back changes on error, later

      // discard useQuery data
      await queryClient.cancelQueries({ queryKey: editEventKey });

      // OPTIMISTIC UPDATES - updating useQuery data to new data when it's available
      // instead of waiting for backend response
      queryClient.setQueryData(
        editEventKey, // to identify which data to change (key)
        updatedData.event // the new data which gets set as the query data (value)
      );

      return { previousData }; // returned value is passed on as context to error block
    },

    onError: (err, updatedData, context) => {
      // console.log({ updatedData });
      queryClient.setQueryData(editEventKey, context?.previousData);
    },

    // called when mutation completes, like a `finally` block
    onSettled: () => {
      // just make sure the latest data from the backend is being used, by discarding cached data
      queryClient.invalidateQueries({ queryKey: editEventKey });
    },
  });

  function handleSubmit(formData: FormData) {
    updateMtn.mutate({ id, event: formData });
    handleClose();
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load information"
          message={(error as ResError).info?.message}
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Close
          </Link>
        </div>
      </>
    );
  }

  return !updateMtn.isSuccess && <Modal onClose={handleClose}>{content}</Modal>;
}
